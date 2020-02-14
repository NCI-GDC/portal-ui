/* @flow */

import React from 'react';
import {
  compose,
  setDisplayName,
} from 'recompose';
import { connect } from 'react-redux';
import { Row } from '@ncigdc/uikit/Flex';
import Showing from '@ncigdc/components/Pagination/Showing';
import Pagination from '@ncigdc/components/Pagination';
import TableActions from '@ncigdc/components/TableActions';
import Table, { Tr } from '@ncigdc/uikit/Table';
import {
  AppendExploreCaseSetButton,
  CreateExploreCaseSetButton,
  RemoveFromExploreCaseSetButton,
} from '@ncigdc/modern_components/withSetAction';

import { theme } from '@ncigdc/theme';
import withSelectIds from '@ncigdc/utils/withSelectIds';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import { withRouter } from 'react-router-dom';
import { isSortedColumn } from '@ncigdc/utils/tables';
import timestamp from '@ncigdc/utils/timestamp';

export default compose(
  setDisplayName('EnhancedExploreCasesTable'),
  withSelectIds,
  withRouter,
  withPropsOnChange(
    ['ssmsAggregationsViewer'],
    ({ ssmsAggregationsViewer: { explore } }) => {
      const { occurrence__case__case_id: { buckets } } = explore.ssms
        .aggregations || {
        occurrence__case__case_id: { buckets: [] },
      };
      const ssmCounts = buckets.reduce(
        (acc, b) => ({
          ...acc,
          [b.key]: b.doc_count,
        }),
        {}
      );
      return { ssmCounts };
    }
  ),
  connect(state => ({ tableColumns: state.tableColumns.exploreCases }))
)(
  ({
    exploreCasesTableViewer: { explore } = {},
    ssmCounts,
    ssmCountsLoading,
    tableColumns,
    parentVariables,
    filters,
    selectedIds,
    setSelectedIds,
    score,
    sort,
    history,
  }) => {
    const prefix = 'cases';
    const { cases } = explore || {};

    if (cases && !cases.hits.edges.length) {
      return <Row style={{ padding: '1rem' }}>No case data found.</Row>;
    }

    const tableInfo = tableColumns.slice().filter(x => !x.hidden);

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
            params={parentVariables}
            prefix={prefix}
            total={cases.hits.total}
            />
          <TableActions
            AppendSetButton={AppendExploreCaseSetButton}
            arrangeColumnKey="exploreCases"
            CreateSetButton={CreateExploreCaseSetButton}
            currentFilters={filters}
            downloadBiospecimen
            downloadClinical
            downloadFields={tableInfo
              .filter(x => x.downloadable)
              .map(x => x.field || x.id)}
            downloadTooltip="Export All Except #Mutations, #Genes and Slides"
            endpoint="case_ssms"
            idField="cases.case_id"
            RemoveFromSetButton={RemoveFromExploreCaseSetButton}
            scope="explore"
            score={score}
            selectedIds={selectedIds}
            sort={sort}
            sortOptions={tableInfo.filter(x => x.sortable)}
            style={{
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              marginLeft: '0.3rem',
            }}
            total={cases.hits.total}
            tsvFilename={`explore-case-table.${timestamp()}.tsv`}
            tsvSelector="#explore-case-table"
            type="case"
            />
        </Row>
        <div style={{ overflowX: 'auto' }}>
          <Table
            body={(
              <tbody>
                {cases.hits.edges.map((e, i) => (
                  <Tr
                    index={i}
                    key={e.node.id}
                    style={{
                      ...(selectedIds.includes(e.node.case_id) && {
                        backgroundColor: theme.tableHighlight,
                      }),
                    }}
                    >
                    {tableInfo.filter(x => x.td).map(x => (
                      <x.td
                        filters={filters}
                        index={i}
                        key={x.id}
                        node={{
                          ...e.node,
                          history,
                        }}
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                        ssmCount={ssmCounts[e.node.case_id]}
                        ssmCountsLoading={ssmCountsLoading}
                        total={cases.hits.total}
                        />
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
                  nodes={cases.hits.edges.map(e => e.node)}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  sorted={isSortedColumn(sort, x.id)}
                  />
              ))}
            id="explore-case-table"
            subheadings={tableInfo
              .filter(x => x.subHeading)
              .map(x => <x.th key={x.id} />)}
            />
        </div>
        <Pagination
          params={parentVariables}
          prefix={prefix}
          total={cases.hits.total}
          />
      </div>
    );
  }
);
