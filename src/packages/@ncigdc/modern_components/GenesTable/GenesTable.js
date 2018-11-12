/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withPropsOnChange, lifecycle } from 'recompose';
import withSize from '@ncigdc/utils/withSize';
import withRouter from '@ncigdc/utils/withRouter';
import Showing from '@ncigdc/components/Pagination/Showing';
import { Row } from '@ncigdc/uikit/Flex';
import Pagination from '@ncigdc/components/Pagination';
import TableActions from '@ncigdc/components/TableActions';
import Table, { Tr } from '@ncigdc/uikit/Table';
import { CreateExploreGeneSetButton } from '@ncigdc/modern_components/withSetAction';
import { AppendExploreGeneSetButton } from '@ncigdc/modern_components/withSetAction';
import { RemoveFromExploreGeneSetButton } from '@ncigdc/modern_components/withSetAction';
import timestamp from '@ncigdc/utils/timestamp';

import tableModel from './GenesTable.model';
import { theme } from '@ncigdc/theme';
import withSelectIds from '@ncigdc/utils/withSelectIds';

export default compose(
  connect(state => {
    return { tableColumns: state.tableColumns.genes };
  }),
  withRouter,
  withState('survivalLoadingId', 'setSurvivalLoadingId', ''),
  withState('ssmCountsLoading', 'setSsmCountsLoading', true),
  withSelectIds,
  withPropsOnChange(
    ['ssmsAggregationsViewer'],
    ({ ssmsAggregationsViewer: { explore } }) => {
      const { ssms: { aggregations } } = explore;
      const ssmCounts = (aggregations || {
        consequence__transcript__gene__gene_id: { buckets: [] },
      }).consequence__transcript__gene__gene_id.buckets.reduce(
        (acc, b) => ({ ...acc, [b.key]: b.doc_count }),
        {}
      );
      return { ssmCounts };
    }
  ),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (nextProps.tableColumns !== this.props.tableColumns) {
        this.setState({ tableColumns: nextProps.tableColumns });
      }
    },
  }),
  withSize()
)(
  ({
    genesTableViewer: { explore } = {},
    filters,
    relay = { route: { params: {} } },
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
    sort,
    score,
  }) => {
    const { genes, filteredCases, cases, cnvCases } = explore || {};
    if (genes && !genes.hits.edges.length) {
      return <Row style={{ padding: '1rem' }}>No gene data found.</Row>;
    }
    const data = !genes ? [] : genes.hits.edges;
    const totalGenes = !genes ? 0 : genes.hits.total;
    const tableInfo = tableColumns.slice().filter(x => !x.hidden);
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
              scope="explore"
              arrangeColumnKey="genes"
              total={totalGenes}
              endpoint="genes"
              downloadTooltip="Export All Except #Cases and #Mutations"
              currentFilters={filters}
              score={score}
              sort={sort}
              downloadFields={[
                'symbol',
                'name',
                'cytoband',
                'biotype',
                'gene_id',
                'is_cancer_gene_census',
              ]}
              tsvSelector="#genes-table"
              tsvFilename={`frequently-mutated-genes.${timestamp()}.tsv`}
              CreateSetButton={CreateExploreGeneSetButton}
              AppendSetButton={AppendExploreGeneSetButton}
              RemoveFromSetButton={RemoveFromExploreGeneSetButton}
              idField="genes.gene_id"
              selectedIds={selectedIds}
            />
          </Row>
        </Row>
        <div style={{ overflowX: 'auto' }}>
          <Table
            id="genes-table"
            headings={tableInfo.map(x => (
              <x.th
                key={x.id}
                context={context}
                nodes={data.map(e => e.node)}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
              />
            ))}
            body={
              <tbody>
                {data.map((e, i) => (
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
                      .map(x => (
                        <x.td
                          key={x.id}
                          node={e.node}
                          context={context}
                          ssmCounts={ssmCounts}
                          cases={cases}
                          defaultFilters={filters}
                          filteredCases={filteredCases}
                          cnvCases={cnvCases}
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
                        />
                      ))}
                  </Tr>
                ))}
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
  }
);
