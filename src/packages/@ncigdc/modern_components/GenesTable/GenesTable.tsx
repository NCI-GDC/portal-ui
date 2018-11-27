import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withPropsOnChange } from 'recompose';
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

import { theme } from '@ncigdc/theme';
import withSelectIds from '@ncigdc/utils/withSelectIds';
interface IGenesProps {
  genesTableViewer: { explore: any };
  filters: object;
  relay: any;
  setSurvivalLoadingId: string;
  survivalLoadingId: string;
  setSelectedSurvivalData: ({}) => any;
  selectedSurvivalData: any;
  hasEnoughSurvivalDataOnPrimaryCurve: boolean;
  context: any;
  query: { [x: string]: any };
  ssmCounts: number[];
  ssmCountsLoading: boolean;
  parentVariables: any;
  tableColumns: any;
  dispatch: any;
  selectedIds: number[];
  setSelectedIds: any;
  sort: any;
  score: number;
}
export default compose<any, any>(
  connect((state: any) => {
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
        (acc: any, b: any) => ({ ...acc, [b.key]: b.doc_count }),
        {}
      );
      return { ssmCounts };
    }
  ),
  withSize()
)(
  ({
    genesTableViewer: { explore } = { explore: '' },
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
  }: IGenesProps) => {
    const { genes, filteredCases, cases, cnvCases } = explore || {
      genes: undefined,
      filteredCases: undefined,
      cases: undefined,
      cnvCases: undefined,
    };
    if (genes && !genes.hits.edges.length) {
      return <Row style={{ padding: '1rem' }}>No gene data found.</Row>;
    }
    const data = !genes ? [] : genes.hits.edges;
    const totalGenes: number = !genes ? 0 : genes.hits.total;
    const tableInfo = tableColumns.slice().filter((x: any) => !x.hidden);
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
            style={{}}
            headings={tableInfo.map((x: any) => (
              <x.th
                key={x.id}
                context={context}
                nodes={data.map((e: any) => e.node)}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
              />
            ))}
            body={
              <tbody>
                {data.map((e: any, i: number) => (
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
                      .filter((x: any) => x.td)
                      .map((x: any) => (
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
