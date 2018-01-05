import React from 'react';
import {
  compose,
  branch,
  renderComponent,
  mapProps,
  setDisplayName,
} from 'recompose';
import { connect } from 'react-redux';
import { Row, Column } from '@ncigdc/uikit/Flex';
import { makeFilter } from '@ncigdc/utils/filters';
import SparkMeterWithTooltip from '@ncigdc/components/SparkMeterWithTooltip';
import { DATA_CATEGORIES } from '@ncigdc/utils/constants';
import { RepositoryFilesLink } from '@ncigdc/components/Links/RepositoryLink';
import SummaryCard from '@ncigdc/components/SummaryCard';
import Link from '@ncigdc/components/Links/Link';
import SampleSize from '@ncigdc/components/SampleSize';
import TableActions from '@ncigdc/components/TableActions';
import tableModels from '@ncigdc/tableModels';
import Table, { Tr, Td } from '@ncigdc/uikit/Table';
import styled from '@ncigdc/theme/styled';

const SPACING = '2rem';

const styles = {
  countCard: {
    width: 'auto',
    marginBottom: SPACING,
  },
  column: {
    flexGrow: 1,
  },
  margin: {
    marginBottom: SPACING,
  },
  icon: {
    width: '4rem',
    height: '4rem',
    color: '#888',
  },
  coloredSquare: {
    display: 'inline-block',
    width: 10,
    height: 10,
    marginRight: 5,
  },
};

const Header = styled(Row, {
  padding: '1rem',
  color: ({ theme }) => theme.greyScale7 || 'silver',
});

export default compose(
  setDisplayName('ProjectPrimarySitesTablePresentation'),
  branch(
    ({ viewer }) => !viewer.projects.hits.edges[0],
    renderComponent(() => <div>No project found.</div>),
  ),
  //   ({ viewer }) =>
  //     viewer.projects.hits.edges[0].node.primary_site.length === 1,
  //   renderComponent(() => <div>No project found.</div>),
  // ),
  connect(state => ({
    tableColumns: state.tableColumns.projectPrimarySites.ids,
  })),
  mapProps(props => ({
    ...props,
    hits: props.viewer.projects.hits,
  })),
)(
  ({
    viewer: { projects: { hits: { edges } } },
    entityType = 'projectPrimarySites',
    downloadable,
    tableColumns,
    tableHeader = 'Primary Sites',
    hits,
  }) => {
    const project = edges[0].node;
    // if (project.primary_site.length >= 1) {
    //   return null;
    // }
    const projectFilter = [
      {
        field: 'cases.project.project_id',
        value: project.project_id,
      },
    ];

    const totalFiles = project.summary.file_count;
    const totalCases = project.summary.case_count;
    // const dataCategories = Object.keys(DATA_CATEGORIES).reduce(
    //   (acc, name) => [
    //     ...acc,
    //     ...project.summary.data_categories
    //       .filter(item => item.data_category.toLowerCase() === name)
    //       .map(item => ({
    //         ...item,
    //         file_count_meter: (
    //           <SparkMeterWithTooltip part={item.file_count} whole={totalFiles} />
    //         ),
    //         case_count_meter: (
    //           <SparkMeterWithTooltip part={item.case_count} whole={totalCases} />
    //         ),
    //       })),
    //   ],
    //   [],
    // );
    const tableInfo = tableModels[entityType]
      .slice()
      // .sort((a, b) => tableColumns.indexOf(a.id) - tableColumns.indexOf(b.id))
      .filter(x => tableColumns.includes(x.id));

    const dataCategories = Object.keys(DATA_CATEGORIES).reduce((acc, key) => {
      const type = project.summary.data_categories.find(
        item => item.data_category === DATA_CATEGORIES[key].full,
      ) || {
        data_category: DATA_CATEGORIES[key].full,
        file_count: 0,
      };

      const linkQuery = {
        filters: makeFilter([
          { field: 'cases.project.project_id', value: project.project_id },
          { field: 'files.data_category', value: [type.data_category] },
        ]),
      };
      return acc.concat({
        ...type,
        id: type.data_category,
        file_count:
          type.file_count > 0 ? (
            <RepositoryFilesLink query={linkQuery}>
              {type.file_count}
            </RepositoryFilesLink>
          ) : (
            '0'
          ),
        file_count_meter: (
          <SparkMeterWithTooltip part={type.file_count} whole={totalFiles} />
        ),
        file_count_value: type.file_count,
        tooltip: (
          <span>
            <b>{type.data_category}</b>
            <br />
            {type.file_count} file{type.file_count > 1 ? 's' : ''}
          </span>
        ),
        // clickHandler: () => {
        //   const newQuery = mergeQuery(linkQuery, query, 'replace');
        //   const q = removeEmptyKeys({
        //     ...newQuery,
        //     filters: newQuery.filters && stringifyJSONParam(newQuery.filters),
        //   });
        //   push({ pathname: '/repository', query: q });
        // },
      });
    }, []);
    return (
      <div>
        <Row>
          <Row>{tableHeader && <Header>{tableHeader}</Header>}</Row>
          {/* <TableActions
            type="project"
            scope="explore"
            // arrangeColumnKey={entityType}
            // total={hits.total}
            endpoint={entityType}
            downloadable={downloadable}
          /> */}
        </Row>
        <div style={{ overflowX: 'auto' }}>
          <Table
            id="project-primary-site-table"
            headings={tableInfo
              .filter(x => !x.subHeading)
              .map(x => <x.th key={x.id} />)}
            subheadings={tableInfo
              .filter(x => x.subHeading)
              .map(x => <x.th key={x.id} />)}
            body={
              <tbody>
                {/* {hits.edges.map((e, i) => (
                  <Tr key={e.node.id} index={i}>
                    {tableInfo
                      .filter(x => x.td)
                      .map(x => <x.td key={x.id} node={e.node} />)}
                  </Tr>
                ))} */}
                {/* <Tr>
                  {hits.total > 1 &&
                    tableInfo
                      .filter(x => x.td)
                      .map(
                        x =>
                          x.total ? (
                            <x.total key={x.id} hits={hits} />
                          ) : (
                            <Td key={x.id} />
                          ),
                      )}
                </Tr> */}
              </tbody>
            }
          />
        </div>
        {/* <SummaryCard
        className="test-data-category-summary"
        tableTitle="Available Cases per Data Category"
        data={dataCategories}
        // footer={`${(dataCategories || []).length} Experimental Strategies`}
        // path="file_count_value"
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
                      field: 'cases.project.project_id',
                      value: project.project_id,
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
      /> */}
      </div>
    );
  },
);
