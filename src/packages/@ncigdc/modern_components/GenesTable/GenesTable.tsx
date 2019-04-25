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
import { CreateExploreGeneSetButton, AppendExploreGeneSetButton, RemoveFromExploreGeneSetButton } from '@ncigdc/modern_components/withSetAction';


import timestamp from '@ncigdc/utils/timestamp';
import { IColumnProps } from '@ncigdc/tableModels/utils';
import { IGroupFilter } from '@ncigdc/utils/filters/types';
import { ISelectedSurvivalDataProps } from '@ncigdc/modern_components/GenesTable/GenesTable.model';
import { theme } from '@ncigdc/theme';
import withSelectIds from '@ncigdc/utils/withSelectIds';

export interface ITotalNumber {
  hits: {
    total: number;
  };
}

export interface INodeProps {
  node: {
    gene_id: string;
    id: string;
    symbol: string;
    name: string;
    cytoband: string[];
    biotype: string;
    numCases: number;
    is_cancer_gene_census: boolean;
    ssm_case: ITotalNumber;
    cnv_case: ITotalNumber;
    case_cnv_gain: ITotalNumber;
    case_cnv_loss: ITotalNumber;
  };
}
interface IGenesProps {
  hits: {
    total: number;
    edges: INodeProps[];
  };
}
interface IGenesTableProps {
  genesTableViewer: {
    explore: {
      genes: IGenesProps | undefined;
      filteredCases: ITotalNumber | undefined;
      cases: ITotalNumber | undefined;
      cnvCases: ITotalNumber | undefined;
    };
  };
  filters: IGroupFilter;
  setSurvivalLoadingId: string;
  survivalLoadingId: string;
  setSelectedSurvivalData: (
    selectedSurvivalData: ISelectedSurvivalDataProps
  ) => void;
  selectedSurvivalData: ISelectedSurvivalDataProps;
  hasEnoughSurvivalDataOnPrimaryCurve: boolean;
  context: string;
  query: { searchTableTab: string; filters: string | IGroupFilter };
  ssmCounts: { [x: string]: number };
  ssmCountsLoading: boolean;
  parentVariables: {
    genesTable_offset: number;
    genesTable_size: number;
    [x: string]: any;
  };
  tableColumns: Array<IColumnProps<boolean>>;
  selectedIds: string[];
  setSelectedIds: (props: string[]) => void;
  sort?: { field: string; order: string };
  score: string;
}
export default compose<IGenesTableProps, JSX.Element>(
  connect(
    (state: {
      tableColumns: { [x: string]: Array<IColumnProps<boolean>> };
      [x: string]: any;
    }) => {
      return { tableColumns: state.tableColumns.genes };
    }
  ),
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
        (
          acc: { [x: string]: number },
          b: { [x: string]: any; doc_count: number }
        ) => ({
          ...acc,
          [b.key]: b.doc_count,
        }),
        {}
      );
      return { ssmCounts };
    }
  ),
  withSize()
)(
  ({
    genesTableViewer: { explore } = {
      explore: {
        genes: undefined,
        filteredCases: undefined,
        cases: undefined,
        cnvCases: undefined,
      },
    },
    filters,
    setSurvivalLoadingId,
    survivalLoadingId,
    setSelectedSurvivalData,
    selectedSurvivalData,
    hasEnoughSurvivalDataOnPrimaryCurve,
    context,
    query,
    ssmCounts = {},
    ssmCountsLoading,
    parentVariables,
    tableColumns,
    selectedIds,
    setSelectedIds,
    sort,
    score,
  }: IGenesTableProps) => {
    const {
      genes, filteredCases, cases, cnvCases,
    } = explore;

    if (genes && !genes.hits.edges.length) {
      return <Row style={{ padding: '1rem' }}>No gene data found.</Row>;
    }
    const data: INodeProps[] = !genes ? [] : genes.hits.edges;
    const totalGenes: number = !genes ? 0 : genes.hits.total;
    const tableInfo = tableColumns
      .slice()
      .filter((x: IColumnProps<boolean>) => !x.hidden);
    return (
      <span>
        <Row
          style={{
            backgroundColor: 'white',
            padding: '1rem',
            justifyContent: 'space-between',
          }}>
          <Showing
            docType="genes"
            params={parentVariables}
            prefix="genesTable"
            total={totalGenes} />
          <Row>
            <TableActions
              AppendSetButton={AppendExploreGeneSetButton}
              arrangeColumnKey="genes"
              CreateSetButton={CreateExploreGeneSetButton}
              currentFilters={filters}
              downloadFields={[
                'symbol',
                'name',
                'cytoband',
                'biotype',
                'gene_id',
                'is_cancer_gene_census',
              ]}
              downloadTooltip="Export All Except #Cases and #Mutations"
              endpoint="genes"
              idField="genes.gene_id"
              RemoveFromSetButton={RemoveFromExploreGeneSetButton}
              scope="explore"
              score={score}
              selectedIds={selectedIds}
              sort={sort}
              total={totalGenes}
              tsvFilename={`frequently-mutated-genes.${timestamp()}.tsv`}
              tsvSelector="#genes-table"
              type="gene" />
          </Row>
        </Row>
        <div style={{ overflowX: 'auto' }}>
          <Table
            body={(
              <tbody>
                {data.map((e: INodeProps, i: number) => (
                  <Tr
                    index={i}
                    key={e.node.id}
                    style={{
                      ...(selectedIds.includes(e.node.gene_id) && {
                        backgroundColor: theme.tableHighlight,
                      }),
                    }}>
                    {tableInfo
                      .filter((x: IColumnProps<boolean>) => x.td)
                      .map((x: IColumnProps<false>) => (
                        <x.td
                          cases={cases}
                          cnvCases={cnvCases}
                          context={context}
                          defaultFilters={filters}
                          filteredCases={filteredCases}
                          hasEnoughSurvivalDataOnPrimaryCurve={
                            hasEnoughSurvivalDataOnPrimaryCurve
                          }
                          key={x.id}
                          node={e.node}
                          query={query}
                          selectedIds={selectedIds}
                          selectedSurvivalData={selectedSurvivalData}
                          setSelectedIds={setSelectedIds}
                          setSelectedSurvivalData={setSelectedSurvivalData}
                          setSurvivalLoadingId={setSurvivalLoadingId}
                          ssmCounts={ssmCounts}
                          survivalLoadingId={survivalLoadingId} />
                      ))}
                  </Tr>
                ))}
              </tbody>
            )}
            headings={tableInfo.map((x: IColumnProps<boolean>) => (
              <x.th
                context={context}
                key={x.id}
                nodes={data.map((e: INodeProps) => e.node)}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds} />
            ))}
            id="genes-table" />
        </div>
        <Pagination
          params={parentVariables}
          prefix="genesTable"
          total={!genes ? 0 : genes.hits.total} />
      </span>
    );
  }
);
