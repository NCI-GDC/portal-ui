/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import { compose, withState, withPropsOnChange } from 'recompose';
import { scaleOrdinal, schemeCategory10 } from 'd3';
import withSize from '@ncigdc/utils/withSize';
import withBetterRouter from '@ncigdc/utils/withRouter';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';
import Showing from '@ncigdc/components/Pagination/Showing';
import MutationsCount from '@ncigdc/components/MutationsCount';
import GeneLink from '@ncigdc/components/Links/GeneLink';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import { Row } from '@ncigdc/uikit/Flex';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import Button from '@ncigdc/uikit/Button';
import { tableToolTipHint } from '@ncigdc/theme/mixins';
import { SpinnerIcon } from '@ncigdc/theme/icons';
import Hidden from '@ncigdc/components/Hidden';
import Pagination from '@ncigdc/components/Pagination';
import SurvivalIcon from '@ncigdc/theme/icons/SurvivalIcon';
import { getSurvivalCurves } from '@ncigdc/utils/survivalplot';
import ProjectBreakdown from '@ncigdc/modern_components/ProjectBreakdown/ProjectBreakdown';
import CosmicIcon from '@ncigdc/theme/icons/Cosmic';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import { ForTsvExport } from '@ncigdc/components/DownloadTableToTsvButton';
import TableActions from '@ncigdc/components/TableActions';

const colors = scaleOrdinal(schemeCategory10);

export default compose(
  withBetterRouter,
  withState('survivalLoadingId', 'setSurvivalLoadingId', ''),
  withState('ssmCountsLoading', 'setSsmCountsLoading', true),
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
)(
  ({
    genesTableViewer: { explore } = {},
    defaultFilters,
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
  }) => {
    const { genes, filteredCases, cases } = explore || {};

    if (genes && !genes.hits.edges.length) {
      return <Row style={{ padding: '1rem' }}>No gene data found.</Row>;
    }

    const data = !genes ? [] : genes.hits.edges.map(x => x.node);
    const totalGenes = !genes ? 0 : genes.hits.total;
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
              prefix="genes"
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
              tsvSelector="#frequently-mutated-genes-table"
              tsvFilename="frequently-mutated-genes.tsv"
            />
          </Row>
        </Row>
        <EntityPageHorizontalTable
          idKey="gene_id"
          tableId="frequently-mutated-genes-table"
          headings={[
            { key: 'symbol', title: 'Symbol' },
            { key: 'name', title: 'Name' },
            { key: 'cytoband', title: 'Cytoband' },
            { key: 'biotype', title: 'Type' },
            {
              key: 'filteredCases',
              title: (
                <Tooltip
                  Component={
                    <span>
                      Breakdown of Affected Cases in {context} <br />
                      # of Cases where Gene is <br />
                      mutated /# Cases tested for Simple Somatic Mutations
                    </span>
                  }
                  style={tableToolTipHint()}
                >
                  # Affected Cases<br />in {context}
                </Tooltip>
              ),
            },
            {
              key: 'projectBreakdown',
              title: (
                <Tooltip
                  Component={
                    <span>
                      # of Cases where Gene contains Simple Somatic Mutations
                      <br />
                      / # Cases tested for Simple Somatic Mutations portal wide
                      <br />
                      Expand to see breakdown by project
                    </span>
                  }
                  style={tableToolTipHint()}
                >
                  # Affected Cases<br /> Across the GDC
                </Tooltip>
              ),
            },
            {
              key: 'num_mutations',
              tdStyle: { textAlign: 'right' },
              title: (
                <Tooltip
                  Component={
                    <span>
                      # of Simple Somatic Mutations in the Gene in {context}
                    </span>
                  }
                  style={tableToolTipHint()}
                >
                  # Mutations
                </Tooltip>
              ),
            },
            {
              key: 'annotations',
              title: 'Annotations',
              tdStyle: { textAlign: 'center', padding: '5px 0 0 0' },
            },
            {
              title: <span>Survival</span>,
              key: 'survival_plot',
              style: { textAlign: 'center', width: '100px' },
            },
          ]}
          data={data
            .map(g => ({
              ...g,
              name: (
                <div style={{ maxWidth: '230px', whiteSpace: 'normal' }}>
                  {g.name}
                </div>
              ),
              symbol: (
                <GeneLink uuid={g.gene_id} query={{ filters: defaultFilters }}>
                  {g.symbol}
                </GeneLink>
              ),
              cytoband: (g.cytoband || []).join(', '),
              filteredCases: (
                <span>
                  <ExploreLink
                    merge
                    query={{
                      searchTableTab: 'cases',
                      filters: addInFilters(
                        query.fmgTable_filters || defaultFilters,
                        makeFilter([
                          { field: 'genes.gene_id', value: [g.gene_id] },
                        ]),
                      ),
                    }}
                  >
                    {(g.numCases || 0).toLocaleString()}
                  </ExploreLink>
                  <span> / </span>
                  <ExploreLink
                    query={{
                      searchTableTab: 'cases',
                      filters: addInFilters(
                        query.fmgTable_filters || defaultFilters,
                        makeFilter([
                          {
                            field: 'cases.available_variation_data',
                            value: ['ssm'],
                          },
                        ]),
                      ),
                    }}
                  >
                    {(filteredCases.hits.total || 0).toLocaleString()}
                  </ExploreLink>
                  <span>{` (${((g.numCases || 0) /
                    filteredCases.hits.total *
                    100).toFixed(2)}%)`}</span>
                </span>
              ),
              projectBreakdown: (
                <ProjectBreakdown
                  filters={makeFilter([
                    { field: 'genes.gene_id', value: g.gene_id },
                  ])}
                  caseTotal={g.case.hits.total}
                  gdcCaseTotal={cases.hits.total}
                />
              ),
              num_mutations: (
                <MutationsCount
                  ssmCount={ssmCounts[g.gene_id]}
                  filters={addInFilters(
                    defaultFilters,
                    makeFilter([
                      { field: 'genes.gene_id', value: [g.gene_id] },
                    ]),
                  )}
                />
              ),
              annotations:
                g.is_cancer_gene_census &&
                  <span>
                    <Tooltip Component="Cancer Gene Census">
                      <CosmicIcon width={'20px'} height={'16px'} />
                    </Tooltip>
                    <ForTsvExport>
                      Cancer Gene Census
                    </ForTsvExport>
                  </span>,
              survival_plot: (
                <Tooltip
                  Component={
                    hasEnoughSurvivalDataOnPrimaryCurve
                      ? `Click icon to plot ${g.symbol}`
                      : 'Not enough survival data'
                  }
                >
                  <Button
                    style={{
                      padding: '2px 3px',
                      backgroundColor: hasEnoughSurvivalDataOnPrimaryCurve
                        ? colors(selectedSurvivalData.id === g.symbol ? 1 : 0)
                        : '#666',
                      color: 'white',
                      margin: '0 auto',
                    }}
                    disabled={!hasEnoughSurvivalDataOnPrimaryCurve}
                    onClick={() => {
                      if (g.symbol !== selectedSurvivalData.id) {
                        setSurvivalLoadingId(g.symbol);
                        getSurvivalCurves({
                          field: 'gene.symbol',
                          value: g.symbol,
                          currentFilters: defaultFilters,
                        }).then(survivalData => {
                          setSelectedSurvivalData(survivalData);
                          setSurvivalLoadingId('');
                        });
                      } else {
                        setSelectedSurvivalData({});
                      }
                    }}
                  >
                    {survivalLoadingId === g.symbol
                      ? <SpinnerIcon />
                      : <SurvivalIcon />}
                    <Hidden>add to survival plot</Hidden>
                  </Button>
                </Tooltip>
              ),
            }))
            // NOTE: manual sort is required because relay does not return items from cache ordered by score (PRTL-1041)
            .sort((a, b) => b.numCases - a.numCases)}
        />
        <Pagination
          prefix="genesTable"
          params={parentVariables}
          total={!genes ? 0 : genes.hits.total}
        />
      </span>
    );
  },
);
