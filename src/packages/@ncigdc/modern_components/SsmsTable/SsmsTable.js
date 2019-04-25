/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import withSize from '@ncigdc/utils/withSize';
import withBetterRouter from '@ncigdc/utils/withRouter';
import Showing from '@ncigdc/components/Pagination/Showing';
import { Row } from '@ncigdc/uikit/Flex';
import Pagination from '@ncigdc/components/Pagination';
import { withTheme } from '@ncigdc/theme';
import { TTheme } from '@ncigdc/theme';
import { IGroupFilter } from '@ncigdc/utils/filters/types';
import TableActions from '@ncigdc/components/TableActions';
import Table, { Tr } from '@ncigdc/uikit/Table';
import { CreateExploreSsmSetButton } from '@ncigdc/modern_components/withSetAction';
import { AppendExploreSsmSetButton } from '@ncigdc/modern_components/withSetAction';
import { RemoveFromExploreSsmSetButton } from '@ncigdc/modern_components/withSetAction';
import withSelectIds from '@ncigdc/utils/withSelectIds';
import tableModel from './SsmsTable.model';
import mapData from './mapData';
import timestamp from '@ncigdc/utils/timestamp';

type TProps = {
  showSurvivalPlot: boolean,
  selectedSurvivalData: {
    id: string,
  },
  context?: string,
  setSelectedSurvivalData: Function,
  viewer: {
    explore: {
      ssms: {
        hits: {
          total: number,
          edges: Array<{
            node: {},
          }>,
        },
      },
      filteredCases: {
        hits: {
          total: number,
        },
      },
    },
  },
  projectBreakdown: Object,
  setSurvivalLoadingId: Function,
  survivalLoadingId: string,
  theme: TTheme,
  query: {
    ssmsTable_offset: string,
    ssmsTable_size: string,
    ssmsTable_filters: string,
  },
  filters: IGroupFilter,
  parentVariables: Object,
  tableColumns: Array<string>,
  hideContext: boolean,
  hideSurvival: boolean,
};

export default compose(
  withSelectIds,
  withBetterRouter,
  withState('survivalLoadingId', 'setSurvivalLoadingId', ''),
  withTheme,
  withSize(),
  connect(state => ({ tableColumns: state.tableColumns.ssms }))
)(
  (
    {
      filters,
      contextFilters,
      showSurvivalPlot = false,
      hasEnoughSurvivalDataOnPrimaryCurve,
      selectedSurvivalData = { id: '' },
      setSelectedSurvivalData = () => {},
      viewer: { explore: { ssms, filteredCases, cases } },
      setSurvivalLoadingId,
      survivalLoadingId,
      theme,
      projectBreakdown,
      context = 'explore',
      query,
      location,
      parentVariables,
      tableColumns,
      hideContext,
      hideSurvival,
      selectedIds,
      setSelectedIds,
    }: TProps = {}
  ) => {
    if (ssms && !ssms.hits.edges.length) {
      return <Row style={{ padding: '1rem' }}>No mutation data found.</Row>;
    }

    // Data has to be sorted because the relay cache does not store the order.
    const data = mapData(ssms.hits.edges.map(x => x.node), theme);

    const totalSsms = ssms ? ssms.hits.total : 0;

    const tableInfo = tableColumns.slice().filter(x => !x.hidden);

    return (
      <span>
        <Row
          style={{
            backgroundColor: 'white',
            padding: '1rem',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <Showing
            docType="somatic mutations"
            prefix="ssmsTable"
            params={parentVariables}
            total={totalSsms}
          />
          <Row style={{ alignItems: 'flex-end' }}>
            <TableActions
              type="ssm"
              scope="explore"
              displayType="mutation"
              currentFilters={query.ssmsTable_filters || filters}
              style={{ marginLeft: '2rem' }}
              arrangeColumnKey="ssms"
              total={totalSsms}
              endpoint="ssms"
              downloadTooltip="Export All Except #Cases"
              downloadFields={[
                'genomic_dna_change',
                'mutation_subtype',
                'consequence.transcript.consequence_type',
                'consequence.transcript.annotation.vep_impact',
                'consequence.transcript.annotation.sift_impact',
                'consequence.transcript.annotation.polyphen_impact',
                'consequence.transcript.is_canonical',
                'consequence.transcript.gene.gene_id',
                'consequence.transcript.gene.symbol',
                'consequence.transcript.aa_change',
                'ssm_id',
              ]}
              tsvSelector="#ssms-table"
              tsvFilename={`frequent-mutations.${timestamp()}.tsv`}
              CreateSetButton={CreateExploreSsmSetButton}
              AppendSetButton={AppendExploreSsmSetButton}
              RemoveFromSetButton={RemoveFromExploreSsmSetButton}
              idField="ssms.ssm_id"
              selectedIds={selectedIds}
              hideColumns={hideSurvival ? ['survival_plot'] : []}
            />
          </Row>
        </Row>
        <div style={{ overflowX: 'auto' }}>
          <Table
            id="ssms-table"
            headings={tableInfo
              .filter(x => (hideContext ? x.id !== 'filteredCases' : true))
              .filter(x => (hideSurvival ? x.id !== 'survival_plot' : true))
              .map(x => (
                <x.th
                  key={x.id}
                  context={context}
                  theme={theme}
                  nodes={data}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                />
              ))}
            body={
              <tbody>
                {data.map((node, i) => (
                  <Tr
                    key={node.id}
                    index={i}
                    style={{
                      ...(selectedIds.includes(node.ssm_id) && {
                        backgroundColor: theme.tableHighlight,
                      }),
                    }}
                  >
                    {tableInfo
                      .filter(x => x.td)
                      .filter(
                        x => (hideContext ? x.id !== 'filteredCases' : true)
                      )
                      .filter(
                        x => (hideSurvival ? x.id !== 'survival_plot' : true)
                      )
                      .map(x => (
                        <x.td
                          key={x.id}
                          location={location}
                          node={node}
                          theme={theme}
                          context={context}
                          cases={cases}
                          defaultFilters={filters}
                          contextFilters={contextFilters}
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
                        />
                      ))}
                  </Tr>
                ))}
              </tbody>
            }
          />
        </div>
        <Pagination
          prefix="ssmsTable"
          params={parentVariables}
          total={!ssms ? 0 : ssms.hits.total}
        />
      </span>
    );
  }
);
