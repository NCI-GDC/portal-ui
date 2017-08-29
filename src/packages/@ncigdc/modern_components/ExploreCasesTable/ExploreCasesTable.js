/* @flow */

import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Row } from '@ncigdc/uikit/Flex';
import Showing from '@ncigdc/components/Pagination/Showing';
import tableModels from '@ncigdc/tableModels';
import Pagination from '@ncigdc/components/Pagination';
import TableActions from '@ncigdc/components/TableActions';
import Table, { Tr } from '@ncigdc/uikit/Table';
import CreateExploreCaseSetButton from '@ncigdc/modern_components/setButtons/CreateExploreCaseSetButton';
import RemoveFromExploreCaseSetButton from '@ncigdc/modern_components/setButtons/RemoveFromExploreCaseSetButton';
import { theme } from '@ncigdc/theme';
import withSelectIds from '@ncigdc/utils/withSelectIds';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';

export default compose(
  withSelectIds,
  withPropsOnChange(
    ['ssmsAggregationsViewer'],
    ({ ssmsAggregationsViewer: { explore } }) => {
      const { occurrence__case__case_id: { buckets } } = explore.ssms
        .aggregations || {
        occurrence__case__case_id: { buckets: [] },
      };
      const ssmCounts = buckets.reduce(
        (acc, b) => ({ ...acc, [b.key]: b.doc_count }),
        {},
      );
      return { ssmCounts };
    },
  ),
  connect(state => ({ tableColumns: state.tableColumns.exploreCases.ids })),
)(
  ({
    exploreCasesTableViewer: { explore } = {},
    ssmCounts,
    ssmCountsLoading,
    tableColumns,
    parentVariables,
    defaultFilters,
    selectedIds,
    setSelectedIds,
  }) => {
    const prefix = 'cases';

    const { cases } = explore || {};

    if (cases && !cases.hits.edges.length) {
      return <Row style={{ padding: '1rem' }}>No case data found.</Row>;
    }

    const tableInfo = tableModels.exploreCases
      .slice()
      .sort((a, b) => tableColumns.indexOf(a.id) - tableColumns.indexOf(b.id))
      .filter(x => tableColumns.includes(x.id));

    return (
      <div>
        <Row
          style={{
            backgroundColor: 'white',
            padding: '1rem',
            justifyContent: 'space-between',
          }}
        >
          <Showing
            docType="cases"
            prefix={prefix}
            params={parentVariables}
            total={cases.hits.total}
          />
          <TableActions
            type="case"
            arrangeColumnKey="exploreCases"
            total={cases.hits.total}
            endpoint="case_ssms"
            downloadTooltip="Export All Except #Mutations and #Genes"
            currentFilters={defaultFilters}
            downloadFields={tableInfo
              .filter(x => x.downloadable)
              .map(x => x.field || x.id)}
            sortOptions={tableInfo.filter(x => x.sortable)}
            tsvSelector="#explore-case-table"
            tsvFilename="explore-case-table.tsv"
            CreateSetButton={CreateExploreCaseSetButton}
            RemoveFromSetButton={RemoveFromExploreCaseSetButton}
            idField="cases.case_id"
            selectedIds={selectedIds}
          />
        </Row>
        <div style={{ overflowX: 'auto' }}>
          <Table
            id="explore-case-table"
            headings={tableInfo
              .filter(x => !x.subHeading)
              .map(x =>
                <x.th
                  key={x.id}
                  nodes={cases.hits.edges}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                />,
              )}
            subheadings={tableInfo
              .filter(x => x.subHeading)
              .map(x => <x.th key={x.id} />)}
            body={
              <tbody>
                {cases.hits.edges.map((e, i) =>
                  <Tr
                    key={e.node.id}
                    index={i}
                    style={{
                      ...(selectedIds.includes(e.node.case_id) && {
                        backgroundColor: theme.tableHighlight,
                      }),
                    }}
                  >
                    {tableInfo
                      .filter(x => x.td)
                      .map(x =>
                        <x.td
                          key={x.id}
                          node={e.node}
                          index={i}
                          total={cases.hits.total}
                          ssmCount={ssmCounts[e.node.case_id]}
                          ssmCountsLoading={ssmCountsLoading}
                          filters={defaultFilters}
                          selectedIds={selectedIds}
                          setSelectedIds={setSelectedIds}
                        />,
                      )}
                  </Tr>,
                )}
              </tbody>
            }
          />
        </div>
        <Pagination
          prefix={prefix}
          params={parentVariables}
          total={cases.hits.total}
        />
      </div>
    );
  },
);
