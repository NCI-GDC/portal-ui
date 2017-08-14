/* @flow */

import React from 'react';
import { compose, setDisplayName, branch, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import Pagination from '@ncigdc/components/Pagination';
import Showing from '@ncigdc/components/Pagination/Showing';
import { Row } from '@ncigdc/uikit/Flex';
import TableActions from '@ncigdc/components/TableActions';
import tableModels from '@ncigdc/tableModels';
import Table, { Tr } from '@ncigdc/uikit/Table';

export default compose(
  setDisplayName('RepoCasesTablePresentation'),
  connect(state => ({ tableColumns: state.tableColumns.cases.ids })),
  branch(
    ({ viewer }) =>
      !viewer.repository.cases.hits ||
      !viewer.repository.cases.hits.edges.length,
    renderComponent(() => <div>No results found</div>),
  ),
)(
  ({
    viewer: { repository: { cases: { hits } } },
    entityType = 'cases',
    tableColumns,
    parentVariables,
  }) => {
    const tableInfo = tableModels[entityType]
      .slice()
      .sort((a, b) => tableColumns.indexOf(a.id) - tableColumns.indexOf(b.id))
      .filter(x => tableColumns.includes(x.id));

    return (
      <div className="test-cases-table">
        <Row
          style={{
            backgroundColor: 'white',
            padding: '1rem',
            justifyContent: 'space-between',
          }}
        >
          <Showing
            docType="cases"
            prefix={entityType}
            params={parentVariables}
            total={hits.total}
          />
          <TableActions
            prefix={entityType}
            entityType={entityType}
            total={hits.total}
            sortKey="cases_sort"
            endpoint="cases"
            downloadFields={tableInfo
              .filter(x => x.downloadable)
              .map(x => x.field || x.id)}
            sortOptions={tableInfo.filter(x => x.sortable)}
            tsvSelector="#repository-cases-table"
            tsvFilename="repository-cases-table.tsv"
          />
        </Row>
        <div style={{ overflowX: 'auto' }}>
          <Table
            id="repository-cases-table"
            headings={tableInfo
              .filter(x => !x.subHeading)
              .map(x => <x.th key={x.id} />)}
            subheadings={tableInfo
              .filter(x => x.subHeading)
              .map(x => <x.th key={x.id} />)}
            body={
              <tbody>
                {hits.edges.map((e, i) =>
                  <Tr key={e.node.id} index={i}>
                    {tableInfo
                      .filter(x => x.td)
                      .map(x =>
                        <x.td
                          key={x.id}
                          node={e.node}
                          index={i}
                          total={hits.total}
                        />,
                      )}
                  </Tr>,
                )}
              </tbody>
            }
          />
        </div>
        <Pagination
          prefix={entityType}
          params={parentVariables}
          total={hits.total}
        />
      </div>
    );
  },
);
