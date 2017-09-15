// @flow

import React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import JSURL from 'jsurl';
import { makeFilter, mergeQuery } from '@ncigdc/utils/filters';
import SummaryCard from '@ncigdc/components/SummaryCard';
import Link from '@ncigdc/components/Links/Link';
import SampleSize from '@ncigdc/components/SampleSize';
import { EXPERIMENTAL_STRATEGIES } from '@ncigdc/utils/constants';
import { RepositoryFilesLink } from '@ncigdc/components/Links/RepositoryLink';
import SparkMeterWithTooltip from '@ncigdc/components/SparkMeterWithTooltip';
import { removeEmptyKeys } from '@ncigdc/utils/uri';
import withRouter from '@ncigdc/utils/withRouter';

export default compose(
  withRouter,
  branch(
    ({ viewer }) => !viewer.repository.cases.hits.edges[0],
    renderComponent(() => <div>No case found.</div>),
  ),
)(({ push, query, viewer: { repository: { cases: { hits: { edges } } } } }) => {
  const p = edges[0].node;
  const totalFiles = p.files.hits.total;

  const experimentalStrategies = EXPERIMENTAL_STRATEGIES.reduce(
    (result, name) => {
      const strat = p.summary.experimental_strategies.find(
        item => item.experimental_strategy.toLowerCase() === name.toLowerCase(),
      );

      if (strat) {
        const linkQuery = {
          filters: makeFilter([
            { field: 'cases.case_id', value: p.case_id },
            {
              field: 'files.experimental_strategy',
              value: [strat.experimental_strategy],
            },
          ]),
        };

        return [
          ...result,
          {
            ...strat,
            id: strat.experimental_strategy,
            file_count: (
              <RepositoryFilesLink query={linkQuery}>
                {strat.file_count}
              </RepositoryFilesLink>
            ),
            file_count_meter: (
              <SparkMeterWithTooltip
                part={strat.file_count}
                whole={totalFiles}
              />
            ),
            file_count_value: strat.file_count,
            tooltip: (
              <span>
                <b>{strat.experimental_strategy}</b>
                <br />
                {strat.file_count} file{strat.file_count > 1 ? 's' : ''}
              </span>
            ),
            clickHandler: () => {
              const newQuery = mergeQuery(linkQuery, query, 'replace');
              const q = removeEmptyKeys({
                ...newQuery,
                filters: newQuery.filters && JSURL.stringify(newQuery.filters),
              });
              push({ pathname: '/repository', query: q });
            },
          },
        ];
      }

      return result;
    },
    [],
  );
  return (
    <span style={{ flex: 1 }}>
      <SummaryCard
        className="test-experimental-strategy-summary"
        tableTitle="File Counts by Experimental Strategy"
        pieChartTitle="File Counts by Experimental Strategy"
        data={experimentalStrategies}
        footer={`${(experimentalStrategies || [])
          .length} Experimental Strategies`}
        path="file_count_value"
        headings={[
          {
            key: 'experimental_strategy',
            title: 'Experimental Strategy',
            color: true,
          },
          {
            key: 'file_count',
            title: 'Files',
            style: { textAlign: 'right' },
          },
          {
            key: 'file_count_meter',
            title: (
              <Link
                pathname="/repository"
                query={{
                  filters: makeFilter([
                    {
                      field: 'cases.case_id',
                      value: p.case_id,
                    },
                  ]),
                  facetTab: 'files',
                  searchTableTab: 'files',
                }}
                title="Browse files"
              >
                <SampleSize n={totalFiles} />
              </Link>
            ),
            thStyle: {
              width: 1,
              textAlign: 'center',
            },
            style: { textAlign: 'left' },
          },
        ]}
      />
    </span>
  );
});
