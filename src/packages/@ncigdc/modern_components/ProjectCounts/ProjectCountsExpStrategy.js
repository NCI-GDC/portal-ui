import React from 'react';
import { scaleOrdinal, schemeCategory20 } from 'd3';
import { compose, branch, renderComponent } from 'recompose';
import JSURL from 'jsurl';
import SummaryCard from '@ncigdc/components/SummaryCard';
import { makeFilter, mergeQuery } from '@ncigdc/utils/filters';
import Link from '@ncigdc/components/Links/Link';
import { removeEmptyKeys } from '@ncigdc/utils/uri';

import { EXPERIMENTAL_STRATEGIES } from '@ncigdc/utils/constants';

const colors20 = scaleOrdinal(schemeCategory20);

const styles = {
  coloredSquare: {
    display: 'inline-block',
    width: 10,
    height: 10,
    marginRight: 5,
  },
};

export default compose(
  branch(
    ({ viewer }) => !viewer.projects.hits.edges[0],
    renderComponent(() => <div>No project found.</div>),
  ),
)(({ viewer: { projects: { hits: { edges } } }, query, push }) => {
  const project = edges[0].node;
  const experimentalStrategies = EXPERIMENTAL_STRATEGIES.reduce(
    (acc, name) => [
      ...acc,
      ...project.summary.experimental_strategies.filter(
        item => item.experimental_strategy.toLowerCase() === name,
      ),
    ],
    [],
  );
  return (
    <SummaryCard
      tableTitle="Cases and File Counts by Experimental Strategy"
      pieChartTitle="File Counts by Experimental Strategy"
      data={experimentalStrategies.map((item, i) => {
        const filters = makeFilter([
          {
            field: 'cases.project.project_id',
            value: [project.project_id],
          },
          {
            field: 'files.experimental_strategy',
            value: [item.experimental_strategy],
          },
        ]);

        return {
          id: item.experimental_strategy,
          experimental_strategy: (
            <span>
              <div
                style={{
                  ...styles.coloredSquare,
                  backgroundColor: colors20(i),
                }}
              />
              {item.experimental_strategy}
            </span>
          ),
          case_count: (
            <Link
              merge="replace"
              pathname="/repository"
              query={{
                filters,
                facetTab: 'cases',
                searchTableTab: 'cases',
              }}
            >
              {(item.case_count || 0).toLocaleString()}
            </Link>
          ),
          file_count: (
            <Link
              merge="replace"
              pathname="/repository"
              query={{
                filters,
                facetTab: 'files',
                searchTableTab: 'files',
              }}
            >
              {(item.file_count || 0).toLocaleString()}
            </Link>
          ),
          file_count_value: item.file_count,
          tooltip: (
            <span>
              <b>{item.experimental_strategy}</b><br />
              {item.file_count} file{item.file_count > 1 ? 's' : ''}
            </span>
          ),
          clickHandler: () => {
            const newQuery = mergeQuery(
              {
                filters,
                facetTab: 'files',
                searchTableTab: 'files',
              },
              query,
              'replace',
            );
            const q = removeEmptyKeys({
              ...newQuery,
              filters: newQuery.filters && JSURL.stringify(newQuery.filters),
            });
            push({ pathname: '/repository', query: q });
          },
        };
      })}
      footer={`${experimentalStrategies.length} Experimental Strategies`}
      path="file_count_value"
      headings={[
        {
          key: 'experimental_strategy',
          title: 'Experimental Strategy',
          color: true,
        },
        {
          key: 'case_count',
          title: 'Cases',
          style: { textAlign: 'right' },
        },
        {
          key: 'file_count',
          title: 'Files',
          style: { textAlign: 'right' },
        },
      ]}
    />
  );
});
