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
import JSURL from 'jsurl';
import sapien from '@oncojs/sapien';
import { withTooltip } from '@ncigdc/uikit/Tooltip';
import { Column } from '@ncigdc/uikit/Flex';
import withRouter from '@ncigdc/utils/withRouter';
import { makeFilter } from '@ncigdc/utils/filters';
import styled from '@ncigdc/theme/styled';
import './humanbody.css';
import {
  HUMAN_BODY_SITES_MAP,
  HUMAN_BODY_ALL_ALLOWED_SITES,
} from '@ncigdc/utils/constants';
import { groupBy, map } from 'lodash';

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
        b => HUMAN_BODY_SITES_MAP[b.key] || b.key,
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
      const { setTooltip, push, groupedData } = this.props;

      const data = groupedData
        .map(({ key, docCount, fileCount, allPrimarySites }) => ({
          _key: key,
          _count: docCount,
          fileCount,
          allPrimarySites,
        }))
        .sort((a, b) => (a._key > b._key ? 1 : -1));

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
          title: 'Cases by Major Primary Site',
          clickHandler: d => {
            const key = d._key.replace(/-/g, ' ');
            const datum = data.find(x => x._key === key);
            if (datum) {
              const query = {
                filters: JSURL.stringify(
                  makeFilter([
                    {
                      field: 'cases.primary_site',
                      value: datum.allPrimarySites,
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
                  {d._count.toLocaleString()} cases (
                  {d.fileCount.toLocaleString()} files)
                </div>
              </span>,
            );
          },
          mouseOutHandler: () => setTooltip(),
          data,
          selector: '#human-body-root',
          width: 380,
          height: 435,
          tickInterval: 1000,
          offsetLeft: root.offsetLeft,
          offsetTop: root.offsetTop,
          primarySiteKey: '_key',
          caseCountKey: '_count',
          fileCountKey: 'fileCount',
        });
      });
    },
  }),
)(() => (
  <Column className="test-home">
    <InsideContainer id="human-body-root" />
  </Column>
));
