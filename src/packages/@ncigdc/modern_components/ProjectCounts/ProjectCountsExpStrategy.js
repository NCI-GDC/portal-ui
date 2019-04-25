import React from 'react';
import { scaleOrdinal, schemeCategory20 } from 'd3';
import { compose, branch, renderComponent } from 'recompose';
import SummaryCard from '@ncigdc/components/SummaryCard';
import { makeFilter, mergeQuery } from '@ncigdc/utils/filters';
import Link from '@ncigdc/components/Links/Link';
import removeEmptyKeys from '@ncigdc/utils/removeEmptyKeys';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import { EXPERIMENTAL_STRATEGIES } from '@ncigdc/utils/constants';
import SparkMeterWithTooltip from '@ncigdc/components/SparkMeterWithTooltip';
import SampleSize from '@ncigdc/components/SampleSize';

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
  const totalFiles = project.summary.file_count;
  const totalCases = project.summary.case_count;

  const experimentalStrategies = EXPERIMENTAL_STRATEGIES.reduce(
    (acc, name) => [
      ...acc,
      ...project.summary.experimental_strategies
        .filter(item => item.experimental_strategy.toLowerCase() === name)
        .map(item => ({
          ...item,
          file_count_meter: (
            <SparkMeterWithTooltip part={item.file_count} whole={totalFiles} />
          ),
          case_count_meter: (
            <SparkMeterWithTooltip part={item.case_count} whole={totalCases} />
          ),
        })),
    ],
    [],
  );
  return (
    <SummaryCard
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
          ...item,
          id: item.experimental_strategy,
          experimental_strategy: (
            <span>
              <div
                style={{
                  ...styles.coloredSquare,
                  backgroundColor: colors20(i),
                }} />
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
              }}>
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
              }}>
              {(item.file_count || 0).toLocaleString()}
            </Link>
          ),
          file_count_value: item.file_count,
          tooltip: (
            <span>
              <b>{item.experimental_strategy}</b>
              <br />
              {item.file_count}
              {' '}
file
              {item.file_count > 1 ? 's' : ''}
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
              filters: newQuery.filters && stringifyJSONParam(newQuery.filters),
            });
            push({
              pathname: '/repository',
              query: q,
            });
          },
        };
      })}
      footer={`${experimentalStrategies.length} Experimental Strategies`}
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
          key: 'case_count_meter',
          title: (
            <Link
              pathname="/repository"
              query={{
                filters: makeFilter([
                  {
                    field: 'cases.project.project_id',
                    value: project.project_id,
                  },
                ]),
                facetTab: 'cases',
                searchTableTab: 'cases',
              }}
              title="Browse cases">
              <SampleSize n={totalCases} />
            </Link>
          ),
          thStyle: {
            width: 1,
            textAlign: 'center',
          },
          style: { textAlign: 'left' },
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
                    field: 'cases.project.project_id',
                    value: project.project_id,
                  },
                ]),
                facetTab: 'files',
                searchTableTab: 'files',
              }}
              title="Browse files">
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
      path="file_count_value"
      pieChartTitle="File Counts by Experimental Strategy"
      tableTitle="Cases and File Counts by Experimental Strategy" />
  );
});
