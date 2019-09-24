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
import { IColumnProps } from '@ncigdc/tableModels/utils';
import { IGroupFilter } from '@ncigdc/utils/filters/types';
import { ISelectedSurvivalDataProps } from '@ncigdc/modern_components/GenesTable/GenesTable.model';
import { withTheme } from '@ncigdc/theme';
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
  theme: any;
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
  withTheme,
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
    context,
    filters,
    hasEnoughSurvivalDataOnPrimaryCurve,
    parentVariables,
    query,
    score,
    selectedIds,
    selectedSurvivalData,
    setSelectedIds,
    setSelectedSurvivalData,
    setSurvivalLoadingId,
    sort,
    ssmCounts = {},
    ssmCountsLoading,
    survivalLoadingId,
    tableColumns,
    theme,
  }: IGenesTableProps) => {
    const { genes, filteredCases, cases, cnvCases } = explore;

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
            headings={tableInfo.map((x: IColumnProps<boolean>) => (
              <x.th
                key={x.id}
                context={context}
                nodes={data.map((e: INodeProps) => e.node)}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
              />
            ))}
            body={
              <tbody>
                {data.map((e: INodeProps, i: number) => (
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
                      .filter((x: IColumnProps<boolean>) => x.td)
                      .map((x: IColumnProps<false>) => (
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
                          theme={theme}
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
