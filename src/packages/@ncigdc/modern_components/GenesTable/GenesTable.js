/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withPropsOnChange, withProps } from 'recompose';
import withSize from '@ncigdc/utils/withSize';
import withRouter from '@ncigdc/utils/withRouter';
import Showing from '@ncigdc/components/Pagination/Showing';
import { Row } from '@ncigdc/uikit/Flex';
import Pagination from '@ncigdc/components/Pagination';
import TableActions from '@ncigdc/components/TableActions';
import Table, { Tr } from '@ncigdc/uikit/Table';
import CreateExploreGeneSetButton from '@ncigdc/modern_components/setButtons/CreateExploreGeneSetButton';
import RemoveFromExploreGeneSetButton from '@ncigdc/modern_components/setButtons/RemoveFromExploreGeneSetButton';

import tableModel from './GenesTable.model';
import { theme } from '@ncigdc/theme';
import withSelectIds from '@ncigdc/utils/withSelectIds';

export default compose(
  withRouter,
  withState('survivalLoadingId', 'setSurvivalLoadingId', ''),
  withState('ssmCountsLoading', 'setSsmCountsLoading', true),
  withProps(({ defaultFilters }) => ({ filters: defaultFilters })),
  withSelectIds,
  withPropsOnChange(
    ['ssmsAggregationsViewer'],
    ({ ssmsAggregationsViewer: { explore } }) => {
      const { ssms: { aggregations } } = explore;
      const ssmCounts = (aggregations || {
        consequence__transcript__gene__gene_id: { buckets: [] },
      }).consequence__transcript__gene__gene_id.buckets
        .reduce((acc, b) => ({ ...acc, [b.key]: b.doc_count }), {});
      return { ssmCounts };
    },
  ),
  withSize(),
  connect(state => ({ tableColumns: state.tableColumns.genes.ids })),
)(
  ({
    genesTableViewer: { explore } = {},
    defaultFilters,
    setSurvivalLoadingId,
    survivalLoadingId,
    setSelectedSurvivalData,
    selectedSurvivalData,
    hasEnoughSurvivalDataOnPrimaryCurve,
    context,
    query,
    ssmCounts = [],
    ssmCountsLoading,
    parentVariables,
    tableColumns,
    dispatch,
    selectedIds,
    setSelectedIds,
  }) => {
    const { genes, filteredCases, cases } = explore || {};

    if (genes && !genes.hits.edges.length) {
      return <Row style={{ padding: '1rem' }}>No gene data found.</Row>;
    }

    const data = !genes ? [] : genes.hits.edges;
    const totalGenes = !genes ? 0 : genes.hits.total;

    const tableInfo = tableModel
      .slice()
      .sort((a, b) => tableColumns.indexOf(a.id) - tableColumns.indexOf(b.id))
      .filter(x => tableColumns.includes(x.id));

    return (
      <span>
        <Row
          style={{
            backgroundColor: 'white',
            padding: '1rem',
            justifyContent: 'space-between',
          }}
        >
          <Showing
            docType="genes"
            prefix="genesTable"
            params={parentVariables}
            total={totalGenes}
          />
          <Row>
            <TableActions
              type="gene"
              arrangeColumnKey="genes"
              total={totalGenes}
              endpoint="genes"
              downloadTooltip="Export All Except #Cases and #Mutations"
              currentFilters={defaultFilters}
              downloadFields={[
                'symbol',
                'name',
                'cytoband',
                'biotype',
                'gene_id',
                'is_cancer_gene_census',
              ]}
              tsvSelector="#genes-table"
              tsvFilename="frequently-mutated-genes.tsv"
              CreateSetButton={CreateExploreGeneSetButton}
              RemoveFromSetButton={RemoveFromExploreGeneSetButton}
              idField="genes.gene_id"
              selectedIds={selectedIds}
            />
          </Row>
        </Row>
        <div style={{ overflowX: 'auto' }}>
          <Table
            id="genes-table"
            headings={tableInfo.map(x =>
              <x.th
                key={x.id}
                context={context}
                nodes={data}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
              />,
            )}
            body={
              <tbody>
                {data.map((e, i) =>
                  <Tr
                    key={e.node.id}
                    index={i}
                    style={{
                      ...(selectedIds.includes(e.node.gene_id) && {
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
                          context={context}
                          ssmCounts={ssmCounts}
                          cases={cases}
                          defaultFilters={defaultFilters}
                          filteredCases={filteredCases}
                          query={query}
                          setSurvivalLoadingId={setSurvivalLoadingId}
                          survivalLoadingId={survivalLoadingId}
                          setSelectedSurvivalData={setSelectedSurvivalData}
                          selectedSurvivalData={selectedSurvivalData}
                          hasEnoughSurvivalDataOnPrimaryCurve={
                            hasEnoughSurvivalDataOnPrimaryCurve
                          }
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
          prefix="genesTable"
          params={parentVariables}
          total={!genes ? 0 : genes.hits.total}
        />
      </span>
    );
  },
);
