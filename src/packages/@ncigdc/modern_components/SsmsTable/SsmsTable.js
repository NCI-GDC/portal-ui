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
import { withTheme, TTheme } from '@ncigdc/theme';

import { IGroupFilter } from '@ncigdc/utils/filters/types';
import TableActions from '@ncigdc/components/TableActions';
import Table, { Tr } from '@ncigdc/uikit/Table';
import { CreateExploreSsmSetButton, AppendExploreSsmSetButton, RemoveFromExploreSsmSetButton } from '@ncigdc/modern_components/withSetAction';


import withSelectIds from '@ncigdc/utils/withSelectIds';
import timestamp from '@ncigdc/utils/timestamp';
import tableModel from './SsmsTable.model';
import mapData from './mapData';

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
          }}>
          <Showing
            docType="somatic mutations"
            params={parentVariables}
            prefix="ssmsTable"
            total={totalSsms} />
          <Row style={{ alignItems: 'flex-end' }}>
            <TableActions
              AppendSetButton={AppendExploreSsmSetButton}
              arrangeColumnKey="ssms"
              CreateSetButton={CreateExploreSsmSetButton}
              currentFilters={query.ssmsTable_filters || filters}
              displayType="mutation"
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
              downloadTooltip="Export All Except #Cases"
              endpoint="ssms"
              hideColumns={hideSurvival ? ['survival_plot'] : []}
              idField="ssms.ssm_id"
              RemoveFromSetButton={RemoveFromExploreSsmSetButton}
              scope="explore"
              selectedIds={selectedIds}
              style={{ marginLeft: '2rem' }}
              total={totalSsms}
              tsvFilename={`frequent-mutations.${timestamp()}.tsv`}
              tsvSelector="#ssms-table"
              type="ssm" />
          </Row>
        </Row>
        <div style={{ overflowX: 'auto' }}>
          <Table
            body={(
              <tbody>
                {data.map((node, i) => (
                  <Tr
                    index={i}
                    key={node.id}
                    style={{
                      ...(selectedIds.includes(node.ssm_id) && {
                        backgroundColor: theme.tableHighlight,
                      }),
                    }}>
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
                          cases={cases}
                          context={context}
                          contextFilters={contextFilters}
                          defaultFilters={filters}
                          filteredCases={filteredCases}
                          hasEnoughSurvivalDataOnPrimaryCurve={
                            hasEnoughSurvivalDataOnPrimaryCurve
                          }
                          key={x.id}
                          location={location}
                          node={node}
                          query={query}
                          selectedIds={selectedIds}
                          selectedSurvivalData={selectedSurvivalData}
                          setSelectedIds={setSelectedIds}
                          setSelectedSurvivalData={setSelectedSurvivalData}
                          setSurvivalLoadingId={setSurvivalLoadingId}
                          survivalLoadingId={survivalLoadingId}
                          theme={theme} />
                      ))}
                  </Tr>
                ))}
              </tbody>
            )}
            headings={tableInfo
              .filter(x => (hideContext ? x.id !== 'filteredCases' : true))
              .filter(x => (hideSurvival ? x.id !== 'survival_plot' : true))
              .map(x => (
                <x.th
                  context={context}
                  key={x.id}
                  nodes={data}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  theme={theme} />
              ))}
            id="ssms-table" />
        </div>
        <Pagination
          params={parentVariables}
          prefix="ssmsTable"
          total={!ssms ? 0 : ssms.hits.total} />
      </span>
    );
  }
);
