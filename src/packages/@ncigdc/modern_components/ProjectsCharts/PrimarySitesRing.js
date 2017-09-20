import React from 'react';
import { groupBy, map } from 'lodash';
import { compose, withProps } from 'recompose';
import { noop } from 'lodash';
import JSURL from 'jsurl';
import withRouter from '@ncigdc/utils/withRouter';
import { setFilter, mergeQuery } from '@ncigdc/utils/filters';
import { removeEmptyKeys } from '@ncigdc/utils/uri';
import DoubleRingChart from '@ncigdc/components/Charts/DoubleRingChart';

import {
  HUMAN_BODY_SITES_MAP,
  HUMAN_BODY_ALL_ALLOWED_SITES,
} from '@ncigdc/utils/constants';

export default compose(
  withRouter,
  withProps(({ viewer, projects }) => ({
    data: map(
      groupBy(
        viewer.repository.cases.aggregations.primary_site.buckets,
        b => HUMAN_BODY_SITES_MAP[b.key] || b.key,
      ),
      (group, majorPrimarySite) => ({
        key: majorPrimarySite,
        docCount: group.reduce((sum, { doc_count }) => sum + doc_count, 0),
        allPrimarySites: group.map(({ key }) => key),
      }),
    ).filter(
      ({ key }) =>
        !['Other And Ill-Defined Sites', 'Not Reported'].includes(key) &&
        HUMAN_BODY_ALL_ALLOWED_SITES.includes(key),
    ),
  })),
  withProps(({ data, query, pathname, push, primarySitesFromProjects }) => ({
    doubleRingData: data.map(d => {
      const primarySiteInfo = primarySitesFromProjects[d.key] || [];

      return {
        key: d.key,
        value: d.docCount,
        tooltip: (
          <span>
            <b>{d.key}</b>
            <br />
            {d.docCount.toLocaleString()} case
            {d.docCount > 1 ? 's' : ''}
          </span>
        ),
        clickHandler: () => {
          const newQuery = mergeQuery(
            {
              filters: setFilter({
                field: 'projects.primary_site',
                value: [].concat(d.key || []),
              }),
            },
            query,
            'toggle',
          );

          const q = removeEmptyKeys({
            ...newQuery,
            filters: newQuery.filters && JSURL.stringify(newQuery.filters),
          });

          push({ pathname, query: q });
        },
        outer: primarySiteInfo.map(ps => ({
          key: ps.projectId,
          value: 10,
          tooltip: (
            <span>
              <b>{ps.name}</b>
              <br />
              {/* {p.summary.case_count.toLocaleString()} case */}
              {/* {p.summary.case_count > 1 ? 's' : ''} */}
            </span>
          ),
          clickHandler: () => {
            const newQuery = mergeQuery(
              {
                filters: setFilter({
                  field: 'projects.project_id',
                  value: [].concat(ps.projectId || []),
                }),
              },
              query,
              'toggle',
            );

            const q = removeEmptyKeys({
              ...newQuery,
              filters: newQuery.filters && JSURL.stringify(newQuery.filters),
            });

            push({ pathname, query: q });
          },
        })),
      };
    }),
  })),
)(
  ({ doubleRingData = [], getColor = noop, primarySiteToColor }) => (
    console.log(primarySiteToColor),
    (
      <DoubleRingChart
        key="pie-chart"
        getFillColor={getColor}
        data={doubleRingData}
        height={200}
        width={200}
      />
    )
  ),
);
