// @flow

import React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import { makeFilter, mergeQuery } from '@ncigdc/utils/filters';
import SummaryCard from '@ncigdc/components/SummaryCard';
import Link from '@ncigdc/components/Links/Link';
import SampleSize from '@ncigdc/components/SampleSize';
import { DATA_CATEGORIES } from '@ncigdc/utils/constants';
import { RepositoryFilesLink } from '@ncigdc/components/Links/RepositoryLink';
import SparkMeterWithTooltip from '@ncigdc/components/SparkMeterWithTooltip';
import { removeEmptyKeys, stringifyJSONParam } from '@ncigdc/utils/uri';
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
  const dataCategories = Object.keys(DATA_CATEGORIES).reduce((acc, key) => {
    const type = p.summary.data_categories.find(
      item => item.data_category === DATA_CATEGORIES[key].full,
    ) || {
      data_category: DATA_CATEGORIES[key].full,
      file_count: 0,
    };

    const linkQuery = {
      filters: makeFilter([
        { field: 'cases.case_id', value: p.case_id },
        { field: 'files.data_category', value: [type.data_category] },
      ]),
    };

    return acc.concat({
      ...type,
      id: type.data_category,
      file_count: type.file_count > 0
        ? <RepositoryFilesLink query={linkQuery}>
            {type.file_count}
          </RepositoryFilesLink>
        : '0',
      file_count_meter: (
        <SparkMeterWithTooltip part={type.file_count} whole={totalFiles} />
      ),
      file_count_value: type.file_count,
      tooltip: (
        <span>
          <b>{type.data_category}</b><br />
          {type.file_count} file{type.file_count > 1 ? 's' : ''}
        </span>
      ),
      clickHandler: () => {
        const newQuery = mergeQuery(linkQuery, query, 'replace');
        const q = removeEmptyKeys({
          ...newQuery,
          filters: newQuery.filters && stringifyJSONParam(newQuery.filters),
        });
        push({ pathname: '/repository', query: q });
      },
    });
  }, []);

  return (
    <span style={{ flex: 1 }}>
      <SummaryCard
        className="test-data-category-summary"
        tableTitle="File Counts by Data Category"
        pieChartTitle="File Counts by Experimental Strategy"
        data={dataCategories}
        footer={`${(dataCategories || []).length} Experimental Strategies`}
        path="file_count_value"
        headings={[
          { key: 'data_category', title: 'Data Category', color: true },
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
