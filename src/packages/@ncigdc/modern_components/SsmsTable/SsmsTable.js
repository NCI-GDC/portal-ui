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
import type { TTheme } from '@ncigdc/theme';
import type { TGroupFilter } from '@ncigdc/utils/filters/types';
import TableActions from '@ncigdc/components/TableActions';
import Table, { Tr } from '@ncigdc/uikit/Table';
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
  relay: {
    route: {
      params: {},
    },
    variables: Object,
  },
  setSurvivalLoadingId: Function,
  survivalLoadingId: string,
  theme: TTheme,
  query: {
    ssmsTable_offset: string,
    ssmsTable_size: string,
    ssmsTable_filters: string,
  },
  defaultFilters: TGroupFilter,
};

export default compose(
  withBetterRouter,
  withState('survivalLoadingId', 'setSurvivalLoadingId', ''),
  withTheme,
  withSize(),
  connect(state => ({ tableColumns: state.tableColumns.ssms.ids })),
)(
  (
    {
      defaultFilters,
      showSurvivalPlot = false,
      hasEnoughSurvivalDataOnPrimaryCurve,
      selectedSurvivalData = { id: '' },
      setSelectedSurvivalData = () => {},
      viewer: { explore: { ssms, filteredCases, cases } },
      relay,
      setSurvivalLoadingId,
      survivalLoadingId,
      theme,
      projectBreakdown,
      context = 'explore',
      query,
      location,
      variables,
      tableColumns,
      hideContext,
      hideSurvival,
    }: TProps = {},
  ) => {
    if (ssms && !ssms.hits.edges.length) {
      return <Row style={{ padding: '1rem' }}>No mutation data found.</Row>;
    }

    // Data has to be sorted because the relay cache does not store the order.
    const data = mapData(ssms.hits.edges.map(x => x.node), theme);

    const prefix = 'ssms';
    const totalSsms = ssms ? ssms.hits.total : 0;

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
            alignItems: 'flex-end',
          }}
        >
          <Showing
            docType="somatic mutations"
            prefix="ssmsTable"
            params={variables}
            total={totalSsms}
          />
          <Row style={{ alignItems: 'flex-end' }}>
            <TableActions
              currentFilters={query.ssmsTable_filters || defaultFilters}
              style={{ marginLeft: '2rem' }}
              prefix={prefix}
              entityType="ssms"
              total={totalSsms}
              endpoint={prefix}
              downloadTooltip="Export All Except #Cases"
              downloadFields={[
                'genomic_dna_change',
                'mutation_subtype',
                'consequence.transcript.consequence_type',
                'consequence.transcript.annotation.impact',
                'consequence.transcript.is_canonical',
                'consequence.transcript.gene.gene_id',
                'consequence.transcript.gene.symbol',
                'consequence.transcript.aa_change',
                'ssm_id',
              ]}
              tsvSelector="#ssms-table"
              tsvFilename="frequent-mutations.tsv"
            />
          </Row>
        </Row>
        <div style={{ overflowX: 'auto' }}>
          <Table
            id="ssms-table"
            headings={tableInfo
              .filter(x => (hideContext ? x.id !== 'filteredCases' : true))
              .filter(x => (hideSurvival ? x.id !== 'survival_plot' : true))
              .map(x => <x.th key={x.id} context={context} theme={theme} />)}
            body={
              <tbody>
                {data.map((node, i) =>
                  <Tr key={node.id} index={i}>
                    {tableInfo
                      .filter(x => x.td)
                      .filter(
                        x => (hideContext ? x.id !== 'filteredCases' : true),
                      )
                      .filter(
                        x => (hideSurvival ? x.id !== 'survival_plot' : true),
                      )
                      .map(x =>
                        <x.td
                          key={x.id}
                          location={location}
                          node={node}
                          theme={theme}
                          context={context}
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
                        />,
                      )}
                  </Tr>,
                )}
              </tbody>
            }
          />
        </div>
        <Pagination
          prefix="ssmsTable"
          params={variables}
          total={!ssms ? 0 : ssms.hits.total}
        />
      </span>
    );
  },
);
