// @flow

import React from 'react';
import { compose, lifecycle, branch, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import sapien from '@oncojs/sapien';
import { withTooltip } from '@ncigdc/uikit/Tooltip';
import { Column } from '@ncigdc/uikit/Flex';
import withRouter from '@ncigdc/utils/withRouter';
import { makeFilter } from '@ncigdc/utils/filters';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import styled from '@ncigdc/theme/styled';
import './humanbody.css';

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
  lifecycle({
    async componentDidMount(): Promise<*> {
      const { setTooltip, push, viewer } = this.props;

      const data = viewer.repository.cases.aggregations.primary_site.buckets
        .map(c => ({
          _key: c.key,
          _count: c.doc_count,
          fileCount: (viewer.repository.files.aggregations.cases__primary_site.buckets.find(
            f => f.key === c.key,
          ) || { doc_count: 0 }).doc_count,
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
          clickHandler: d => {
            const key = d._key.replace(/-/g, ' ');
            if (data.find(x => x._key === key)) {
              const query = {
                filters: stringifyJSONParam(
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
    },
  }),
)(() =>
  <Column className="test-home">
    <InsideContainer id="human-body-root" />
  </Column>,
);
