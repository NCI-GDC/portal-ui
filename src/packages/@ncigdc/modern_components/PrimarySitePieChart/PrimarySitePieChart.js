// @flow
import React from 'react';
import { compose } from 'recompose';
import JSURL from 'jsurl';
import { uniq } from 'lodash';

import DoubleRingChart from '@ncigdc/components/Charts/DoubleRingChart';
import { setFilter, mergeQuery } from '@ncigdc/utils/filters';
import { removeEmptyKeys } from '@ncigdc/utils/uri';
import withRouter from '@ncigdc/utils/withRouter';
import { PRIMARY_SITES_MAP } from '@ncigdc/utils/constants';
const enhance = compose(withRouter);

const PrimarySitePieChart = ({
  primarySiteToColor,
  projects,
  query,
  pathname,
  push,
  viewer,
}) => {
  const buckets = viewer.repository.cases.aggregations.primary_site.buckets;

  const doubleRingData = projects.reduce((acc, project) => {
    return project.primary_site.reduce((acc, primarySite) => {
      const bucket = buckets.find(bucket => bucket.key === primarySite);
      if (!bucket) return acc;
      const existing = acc[primarySite] || {};
      const primarySiteCasesCount = (existing.value || 0) + bucket.doc_count;
      const allPrimarySites = uniq(
        [primarySite].concat(
          Object.entries(PRIMARY_SITES_MAP)
            .filter(([, v]) => v === primarySite)
            .map(([k]) => k),
        ),
      );
      return {
        ...acc,
        [primarySite]: {
          key: primarySite,
          value: primarySiteCasesCount,
          tooltip: (
            <span>
              <b>{allPrimarySites.map(p => <span key={p}>{p}<br /></span>)}</b>
              {primarySiteCasesCount.toLocaleString()}
              {' '}
              case
              {primarySiteCasesCount > 1 ? 's' : ''}
            </span>
          ),
          clickHandler: () => {
            const newQuery = mergeQuery(
              {
                filters: setFilter({
                  field: 'projects.primary_site',
                  value: allPrimarySites,
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
          outer: [
            ...(existing.outer || []),
            {
              key: project.project_id,
              value: bucket.doc_count,
              tooltip: (
                <span>
                  <b>{project.project_id}: {project.name}</b><br />
                  {bucket.doc_count.toLocaleString()}
                  {' '}
                  case
                  {bucket.doc_count > 1 ? 's' : ''}
                </span>
              ),
              clickHandler: () => {
                const newQuery = mergeQuery(
                  {
                    filters: setFilter({
                      field: 'projects.project_id',
                      value: [].concat(project.project_id || []),
                    }),
                  },
                  query,
                  'toggle',
                );

                const q = removeEmptyKeys({
                  ...newQuery,
                  filters:
                    newQuery.filters && JSURL.stringify(newQuery.filters),
                });

                push({ pathname, query: q });
              },
            },
          ],
        },
      };
    }, acc);
  }, {});

  return (
    <DoubleRingChart
      key="pie-chart"
      colors={primarySiteToColor}
      data={Object.values(doubleRingData)}
      height={200}
      width={200}
    />
  );
};

export default enhance(PrimarySitePieChart);
