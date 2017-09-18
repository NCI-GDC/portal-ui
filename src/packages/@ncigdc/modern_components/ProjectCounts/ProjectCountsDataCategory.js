import React from 'react';
import { scaleOrdinal, schemeCategory20 } from 'd3';
import { compose, branch, renderComponent } from 'recompose';
import SummaryCard from '@ncigdc/components/SummaryCard';
import { makeFilter, mergeQuery } from '@ncigdc/utils/filters';
import Link from '@ncigdc/components/Links/Link';
import { removeEmptyKeys } from '@ncigdc/utils/uri';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import { DATA_CATEGORIES } from '@ncigdc/utils/constants';

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
  const dataCategories = Object.keys(DATA_CATEGORIES).reduce((acc, key) => {
    const type = project.summary.data_categories.find(
      item => item.data_category === DATA_CATEGORIES[key].full,
    );

    return acc.concat(
      type || {
        data_category: DATA_CATEGORIES[key].full,
        file_count: 0,
        case_count: 0,
      },
    );
  }, []);
  return (
    <SummaryCard
      tableTitle="Cases and File Counts by Data Category"
      pieChartTitle="File Counts by Data Category"
      data={dataCategories.map((item, i) => {
        const filters = makeFilter([
          {
            field: 'cases.project.project_id',
            value: [project.project_id],
          },
          { field: 'files.data_category', value: [item.data_category] },
        ]);

        return {
          id: item.data_category,
          data_category: (
            <span>
              <div
                style={{
                  ...styles.coloredSquare,
                  backgroundColor: colors20(i),
                }}
              />
              {item.data_category}
            </span>
          ),
          case_count:
            item.case_count > 0 ? (
              <Link
                merge="replace"
                pathname="/repository"
                query={{
                  filters,
                  facetTab: 'cases',
                  searchTableTab: 'cases',
                }}
              >
                {item.case_count.toLocaleString()}
              </Link>
            ) : (
              '0'
            ),
          file_count: item.file_count ? (
            <Link
              merge="replace"
              pathname="/repository"
              query={{
                filters,
                facetTab: 'files',
                searchTableTab: 'files',
              }}
            >
              {item.file_count.toLocaleString()}
            </Link>
          ) : (
            '0'
          ),
          file_count_value: item.file_count,
          tooltip: (
            <span>
              <b>{item.data_category}</b>
              <br />
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
              filters: newQuery.filters && stringifyJSONParam(newQuery.filters),
            });
            push({ pathname: '/repository', query: q });
          },
        };
      })}
      footer={`${dataCategories.length} Data Categories`}
      path="file_count_value"
      headings={[
        { key: 'data_category', title: 'Data Category', color: true },
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
