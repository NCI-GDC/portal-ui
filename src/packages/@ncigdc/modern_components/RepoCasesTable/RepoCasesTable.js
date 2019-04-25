/* @flow */

import React from 'react';
import {
  compose, setDisplayName, branch, renderComponent,
} from 'recompose';
import { connect } from 'react-redux';
import Pagination from '@ncigdc/components/Pagination';
import Showing from '@ncigdc/components/Pagination/Showing';
import { Row } from '@ncigdc/uikit/Flex';
import TableActions from '@ncigdc/components/TableActions';
import tableModels from '@ncigdc/tableModels';
import Table, { Tr } from '@ncigdc/uikit/Table';
import { CreateRepositoryCaseSetButton, AppendRepositoryCaseSetButton, RemoveFromRepositoryCaseSetButton } from '@ncigdc/modern_components/withSetAction';


import { theme } from '@ncigdc/theme';
import withSelectIds from '@ncigdc/utils/withSelectIds';
import timestamp from '@ncigdc/utils/timestamp';

export default compose(
  setDisplayName('RepoCasesTablePresentation'),
  connect(state => ({ tableColumns: state.tableColumns.cases })),
  branch(
    ({ viewer }) => !viewer.repository.cases.hits ||
      !viewer.repository.cases.hits.edges.length,
    renderComponent(() => <div>No results found</div>)
  ),
  withSelectIds
)(
  ({
    viewer: { repository: { cases: { hits } } },
    entityType = 'cases',
    tableColumns,
    variables,
    selectedIds,
    setSelectedIds,
    score,
    sort,
  }) => {
    const tableInfo = tableColumns.slice().filter(x => !x.hidden);

    return (
      <div className="test-cases-table">
        <Row
          style={{
            backgroundColor: 'white',
            padding: '1rem',
            justifyContent: 'space-between',
          }}>
          <Showing
            docType="cases"
            params={variables}
            prefix={entityType}
            total={hits.total} />
          <TableActions
            AppendSetButton={AppendRepositoryCaseSetButton}
            arrangeColumnKey={entityType}
            CreateSetButton={CreateRepositoryCaseSetButton}
            currentFilters={variables.filters}
            downloadBiospecimen
            downloadClinical
            downloadFields={tableInfo
              .filter(x => x.downloadable)
              .map(x => x.field || x.id)}
            endpoint="cases"
            idField="cases.case_id"
            RemoveFromSetButton={RemoveFromRepositoryCaseSetButton}
            scope="repository"
            score={variables.score}
            selectedIds={selectedIds}
            sort={variables.cases_sort}
            sortOptions={tableInfo.filter(x => x.sortable)}
            total={hits.total}
            tsvFilename={`repository-cases-table.${timestamp()}.tsv`}
            tsvSelector="#repository-cases-table"
            type="case" />
        </Row>
        <div style={{ overflowX: 'auto' }}>
          <Table
            body={(
              <tbody>
                {hits.edges.map((e, i) => (
                  <Tr
                    index={i}
                    key={e.node.id}
                    style={{
                      ...(selectedIds.includes(e.node.case_id) && {
                        backgroundColor: theme.tableHighlight,
                      }),
                    }}>
                    {tableInfo
                      .filter(x => x.td)
                      .map(x => (
                        <x.td
                          edges={hits.edges}
                          index={i}
                          key={x.id}
                          node={e.node}
                          selectedIds={selectedIds}
                          setSelectedIds={setSelectedIds}
                          total={hits.total} />
                      ))}
                  </Tr>
                ))}
              </tbody>
            )}
            headings={tableInfo
              .filter(x => !x.subHeading)
              .map(x => (
                <x.th
                  key={x.id}
                  nodes={hits.edges}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds} />
              ))}
            id="repository-cases-table"
            subheadings={tableInfo
              .filter(x => x.subHeading)
              .map(x => <x.th key={x.id} />)} />
        </div>
        <Pagination params={variables} prefix={entityType} total={hits.total} />
      </div>
    );
  }
);
