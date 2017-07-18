// @flow

import React from 'react';
import _ from 'lodash';
import { compose, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import JSURL from 'jsurl';

import sapien from '@oncojs/sapien';

import { withTooltip } from '@ncigdc/uikit/Tooltip';
import { Row, Column } from '@ncigdc/uikit/Flex';

import withRouter from '@ncigdc/utils/withRouter';
import { makeFilter } from '@ncigdc/utils/filters';

import styled from '@ncigdc/theme/styled';
import GDCAppsRow from '@ncigdc/components/GDCApps/GDCAppsRow';

import ExploringLinks from './ExploringLinks';
import HomeSearch from './HomeSearch';
import PortalSummary from './PortalSummary';

import './humanbody.css';

type TTransformChartData = ({ hits: Array<Object> }) => Array<Object>;
const transformChartData: TTransformChartData = ({ hits }) => {
  if (!hits) return [];

  // reduce the array keyed on projectID
  const primarySites = hits.reduce((primarySiteData, project) => {
    const primarySite = project.primary_site;

    if (primarySite) {
      if (!_.isArray(primarySiteData[primarySite])) {
        primarySiteData[primarySite] = [];
      }

      primarySiteData[primarySite].push(project);
    }

    return primarySiteData;
  }, {});

  const primarySiteIDs = _.keys(primarySites);

  if (!primarySiteIDs.length) return [];

  const firstPassProjectData = primarySiteIDs
    .map(pID => {
      const primarySiteData = primarySites[pID];
      let caseCount = 0;
      let fileCount = 0;

      for (let i = 0; i < primarySiteData.length; i++) {
        caseCount += +_.get(primarySiteData[i], 'summary.case_count', 0);
        fileCount += +_.get(primarySiteData[i], 'summary.file_count', 0);
      }

      /* _key and _count are required data properties for the marked bar chart */
      return {
        _key: pID,
        values: primarySiteData,
        _count: caseCount,
        fileCount,
      };
    })
    .filter(d => d._count > 0)
    .sort((a, b) => b._count - a._count);

  return firstPassProjectData.map(primarySite => {
    const dataStack: any = {};

    let primarySiteTotal = 0;

    _.assign(dataStack, primarySite);

    const sortedProjects = primarySite.values.sort(
      (a, b) => a.summary.case_count - b.summary.case_count,
    );

    dataStack.stacks = sortedProjects.map(project => {
      // Make sure previous site y1 > y0
      if (primarySiteTotal > 0) {
        primarySiteTotal++;
      }

      const newPrimarySiteTotal = primarySiteTotal + project.summary.case_count;

      const stack = {
        _key: primarySite._key,
        primarySite: primarySite._key,
        y0: primarySiteTotal,
        y1: newPrimarySiteTotal,
        projectID: project.project_id,
        caseCount: project.summary.case_count,
        fileCount: project.summary.file_count,
      };

      primarySiteTotal = newPrimarySiteTotal;

      return stack;
    });

    dataStack._maxY = primarySiteTotal;

    return dataStack;
  });
};

const center = {
  alignItems: 'center',
  justifyContent: 'center',
};

const Title = styled.div({
  color: 'white',
  fontSize: '3rem',
});

const SubTitle = styled.div({
  color: 'white',
});

const GradientContainer = styled(Row, {
  backgroundColor: '#000',
  backgroundImage:
    'radial-gradient(ellipse at center, rgba(147,206,222,1) 0%, rgba(117,189,209,1) 48%, rgba(73,129,189,1) 100%)',
});

const containerStyle = {
  flex: 1,
  padding: '3rem',
  height: '50rem',
  position: 'relative',
};

const InsideContainer = styled.div(containerStyle);
const CenteredColumnContainer = styled(Column, {
  ...containerStyle,
  ...center,
});

const initialState = {
  humanBodyLoading: true,
};

const Home = compose(
  withTooltip,
  withState('state', 'setState', initialState),
  connect(state => ({ config: state.versionInfo })),
  withRouter,
  lifecycle({
    async componentDidMount(): Promise<*> {
      const { setState, setTooltip, push, humanBodyData } = this.props;

      setState(state => ({
        ...state,
        humanBodyLoading: !humanBodyData.length,
      }));

      const data = transformChartData({ hits: humanBodyData }).sort(
        (a, b) => (a._key > b._key ? 1 : -1),
      );

      if (humanBodyData.length) {
        setTimeout(() => {
          const highlights = document.querySelectorAll(
            '#human-body-highlights > svg',
          );
          for (const h of highlights) {
            if (!data.some(d => d._key === h.id.replace(/-/g, ' '))) {
              h.style.display = 'none';
            }
          }
        }, 100);
        setTimeout(() => {
          const root = document.getElementById('human-body-root');
          sapien({
            clickHandler: d => {
              const key = d._key.replace(/-/g, ' ');
              if (data.find(x => x._key === key)) {
                const query = {
                  filters: JSURL.stringify(
                    makeFilter([
                      {
                        field: 'cases.primary_site',
                        value: [key],
                      },
                    ]),
                  ),
                };
                push({ pathname: '/exploration', query });
              } else {
                setTooltip();
              }
            },
            mouseOverHandler: d => {
              setTooltip(
                <span>
                  <div style={{ fontSize: '16px', color: '#bb0e3d' }}>
                    {d._key}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgb(20, 20, 20)' }}>
                    {d._count.toLocaleString()}
                    {' '}
                    cases (
                    {d.fileCount.toLocaleString()}
                    {' '}
                    files)
                  </div>
                </span>,
              );
            },
            mouseOutHandler: () => setTooltip(),
            data,
            selector: '#human-body-root',
            width: 380,
            height: 435,
            offsetLeft: root.offsetLeft,
            offsetTop: root.offsetTop,
            primarySiteKey: '_key',
            caseCountKey: '_count',
            fileCountKey: 'fileCount',
          });
        });
      }
    },
  }),
)(({ state: { humanBodyLoading }, config, ...props }) =>
  <Column data-test="Home">
    <GradientContainer>
      <InsideContainer>
        <SubTitle style={{ fontSize: '2rem' }}>
          Harmonized Cancer Datasets
        </SubTitle>
        <Title>Genomic Data Commons Data Portal</Title>
        <SubTitle style={{ margin: '1rem 0' }}>
          <em>Get Started by Exploring:</em>
        </SubTitle>
        <ExploringLinks />
        <HomeSearch />
        <PortalSummary
          dataRelease={config.dataRelease}
          projectsCountData={props.projectsCountData}
          primarySitesCountData={props.primarySitesCountData}
          casesCountData={props.casesCountData}
          filesCountData={props.filesCountData}
          genesCountData={props.genesCountData}
          ssmsCountData={props.ssmsCountData}
        />
      </InsideContainer>
      {humanBodyLoading &&
        <CenteredColumnContainer>
          <Row
            style={{ color: 'white', fontSize: '1.2em', marginBottom: '1rem' }}
          >
            Loading, please wait...
          </Row>
          <span
            style={{ color: 'white' }}
            className="fa fa-spinner fa-spin fa-2x"
          />
        </CenteredColumnContainer>}
      {!humanBodyLoading && <InsideContainer id="human-body-root" />}
    </GradientContainer>
    <Column style={{ paddingTop: '7rem', alignItems: 'center' }}>
      <Row style={{ fontSize: '1.3em' }}>GDC Applications</Row>
      <Row style={{ textAlign: 'center' }}>
        The GDC Data Portal is a robust data-driven platform that allows cancer
        <br />
        researchers and bioinformaticians to search and download cancer data for
        analysis. The GDC applications include:
      </Row>
      <GDCAppsRow />
    </Column>
  </Column>,
);

export default Home;
