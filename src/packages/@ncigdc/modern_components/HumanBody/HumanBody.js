// @flow

import React from 'react';
import {
  compose,
  lifecycle,
  branch,
  renderComponent,
  withProps,
} from 'recompose';
import { connect } from 'react-redux';
import sapien from '@oncojs/sapien';
import { withTooltip } from '@ncigdc/uikit/Tooltip';
import { Column, Row } from '@ncigdc/uikit/Flex';
import withRouter from '@ncigdc/utils/withRouter';
import { makeFilter } from '@ncigdc/utils/filters';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import styled from '@ncigdc/theme/styled';
import './humanbody.css';
import {
  HUMAN_BODY_SITES_MAP,
  HUMAN_BODY_ALL_ALLOWED_SITES,
} from '@ncigdc/utils/constants';
import {
  groupBy,
  map,
  maxBy,
  floor,
} from 'lodash';

const containerStyle = {
  flex: 1,
  padding: '3rem',
  height: '50rem',
  position: 'relative',
};

const InsideContainer = styled.div(containerStyle);

export default compose(
  branch(
    ({ viewer }) => !viewer.repository.cases.aggregations,
    renderComponent(() => <div>No data found.</div>),
  ),
  withTooltip,
  connect(state => ({ config: state.versionInfo })),
  withRouter,
  withProps(({ viewer }) => ({
    groupedData: map(
      groupBy(
        viewer.repository.cases.aggregations.primary_site.buckets,
        b => HUMAN_BODY_SITES_MAP[b.key.toLowerCase()] || b.key,
      ),
      (group, majorPrimarySite) => ({
        key: majorPrimarySite,
        docCount: group.reduce((sum, { doc_count }) => sum + doc_count, 0),
        fileCount: group.reduce(
          (sumFiles, { key }) =>
            (viewer.repository.files.aggregations.cases__primary_site.buckets.find(
              f => f.key === key,
            ) || { doc_count: 0 }).doc_count + sumFiles,
          0,
        ),
        allPrimarySites: group.map(({ key }) => key),
      }),
    ).filter(
      ({ key }) =>
        !['Other And Ill-Defined Sites', 'Not Reported'].includes(key) &&
        HUMAN_BODY_ALL_ALLOWED_SITES.includes(key),
    ),
  })),
  lifecycle({
    async componentDidMount(): Promise<*> {
      const { groupedData, push, setTooltip } = this.props;
      // groupedData[0].docCount = 120000;
      let factor;
      // factor = floor(maxBy(groupedData, 'docCount').docCount * 21 / 24, -2) / 5;

      const data = groupedData.map(d => ({
        ...d,
        docCount: d.docCount / 1000,
      })).sort((a, b) => (a.key > b.key ? 1 : -1));

      setTimeout(() => {
        const highlights = document.querySelectorAll(
          '#human-body-highlights > svg',
        );
        for (const h of highlights) {
          if (!data.some(d => d.key === h.id.replace(/-/g, ' '))) {
            h.style.display = 'none';
          }
        }
      }, 100);
      setTimeout(() => {
        const root = document.getElementById('human-body-root');
        sapien({
          title: 'Cases by Major Primary Site',
          clickHandler: d => {
            const key = d.key.replace(/-/g, ' ');
            const datum = data.find(x => x.key === key);
            if (datum) {
              const query = {
                filters: stringifyJSONParam(
                  makeFilter([
                    {
                      field: 'cases.primary_site',
                      value: datum.allPrimarySites,
                    },
                  ]),
                ),
              };
              push({
                pathname: '/exploration',
                query,
              });
            } else {
              setTooltip();
            }
          },
          mouseOverHandler: d => {
            setTooltip(
              <span>
                <div
                  style={{
                    fontSize: '16px',
                    color: '#bb0e3d',
                  }}
                  >
                  {d.key}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgb(20, 20, 20)',
                  }}
                  >
                  {(d.docCount * 1000).toLocaleString()}
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
          tickInterval: 1,
          offsetLeft: root.offsetLeft,
          offsetTop: root.offsetTop,
          primarySiteKey: 'key',
          caseCountKey: 'docCount',
          fileCountKey: 'fileCount',
        });
      });
    },
  }),
)(() => (
  <Column className="test-home">
    <InsideContainer id="human-body-root" />
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 625,
        top: 465,
        color: 'black',
        fontSize: 12,
      }}
      >
      (in 1000s)
    </div>
  </Column>
));
