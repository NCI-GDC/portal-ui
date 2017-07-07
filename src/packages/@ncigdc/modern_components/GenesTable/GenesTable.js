/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay/classic';
import { compose, withState, withPropsOnChange } from 'recompose';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { parse } from 'query-string';
import { scaleOrdinal, schemeCategory10 } from 'd3';
import {
  parseIntParam,
  parseFilterParam,
  parseJSURLParam,
} from '@ncigdc/utils/uri';
import { viewerQuery } from '@ncigdc/routes/queries';
import withSize from '@ncigdc/utils/withSize';
import withBetterRouter from '@ncigdc/utils/withRouter';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';
import Showing from '@ncigdc/components/Pagination/Showing';
import MutationsCount from '@ncigdc/components/MutationsCount';
import GeneLink from '@ncigdc/components/Links/GeneLink';
import { handleReadyStateChange } from '@ncigdc/dux/loaders';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import { ConnectedLoader } from '@ncigdc/uikit/Loaders/Loader';
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
const COMPONENT_NAME = 'GenesTable';

const createRenderer = (Route, Container) =>
  compose(connect(), withRouter)((props: mixed) =>
    <div style={{ position: 'relative', minHeight: 170 }}>
      <Relay.Renderer
        environment={Relay.Store}
        queryConfig={new Route(props)}
        onReadyStateChange={handleReadyStateChange(COMPONENT_NAME, props)}
        Container={Container}
        render={({ props: relayProps }) =>
          relayProps ? <Container {...relayProps} {...props} /> : undefined // needed to prevent flicker
        }
      />
      <ConnectedLoader name={COMPONENT_NAME} />
    </div>,
  );

class Route extends Relay.Route {
  static routeName = COMPONENT_NAME;
  static queries = {
    ...viewerQuery,
    exploreSsms: () => Relay.QL`query { viewer }`,
  };
  static prepareParams = ({
    location: { search },
    defaultSize = 10,
    defaultFilters = null,
  }) => {
    const q = parse(search);

    return {
      genesTable_filters: parseFilterParam(
        q.genesTable_filters,
        defaultFilters,
      ),
      genesTable_offset: parseIntParam(q.genesTable_offset, 0),
      genesTable_size: parseIntParam(q.genesTable_size, defaultSize),
      genesTable_sort: parseJSURLParam(q.genesTable_sort, null),
      geneCaseFilter: addInFilters(
        q.genesTable_filters || defaultFilters,
        makeFilter([
          {
            field: 'cases.available_variation_data',
            value: 'ssm',
          },
        ]),
      ),
    };
  };
}

const createContainer = Component =>
  Relay.createContainer(Component, {
    initialVariables: {
      ssmCountsfilters: null,
      genesTable_filters: null,
      genesTable_size: 10,
      genesTable_offset: 0,
      score: 'case.project.project_id',
      geneCaseFilter: null,
      ssmTested: makeFilter([
        {
          field: 'cases.available_variation_data',
          value: 'ssm',
        },
      ]),
    },
    fragments: {
      exploreSsms: () => Relay.QL`
        fragment on Root {
          explore {
            ssms {
              aggregations(filters: $ssmCountsfilters aggregations_filter_themselves: true) {
                consequence__transcript__gene__gene_id {
                  buckets {
                    key
                    doc_count
                  }
                }
              }
            }
          }
        }
      `,
      viewer: () => Relay.QL`
        fragment on Root {
          explore {
            cases { hits(first: 0 filters: $ssmTested) { total }}
            filteredCases: cases {
              hits(first: 0 filters: $geneCaseFilter) {
                total
              }
            }
            genes {
              hits (
                first: $genesTable_size
                offset: $genesTable_offset
                filters: $genesTable_filters
                score: $score
              ) {
                total
                edges {
                  node {
                    numCases: score
                    symbol
                    name
                    cytoband
                    biotype
                    gene_id
                    is_cancer_gene_census
                    case {
                      hits(first: 0 filters: $ssmTested) {
                        total
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
    },
  });

const Component = compose(
  withBetterRouter,
  withState('survivalLoadingId', 'setSurvivalLoadingId', ''),
  withState('ssmCountsLoading', 'setSsmCountsLoading', true),
  withPropsOnChange(
    ['viewer'],
    ({
      ssmCountsLoading,
      setSsmCountsLoading,
      viewer,
      relay,
      defaultFilters,
    }: TTableProps) => {
      const { hits } = viewer.explore.genes;
      const geneIds = hits.edges.map(e => e.node.gene_id);
      if (!ssmCountsLoading) {
        setSsmCountsLoading(true);
      }
      relay.setVariables(
        {
          ssmCountsfilters: geneIds.length
            ? addInFilters(
                defaultFilters,
                makeFilter([
                  {
                    field: 'consequence.transcript.gene.gene_id',
                    value: geneIds,
                  },
                ]),
              )
            : null,
        },
        readyState => {
          if (readyState.done) {
            setSsmCountsLoading(false);
          }
        },
      );
    },
  ),
  withPropsOnChange(['exploreSsms'], ({ exploreSsms: { explore } }) => {
    const { ssms: { aggregations } } = explore;
    const ssmCounts = (aggregations || {
      consequence__transcript__gene__gene_id: { buckets: [] },
    }).consequence__transcript__gene__gene_id.buckets
      .reduce((acc, b) => ({ ...acc, [b.key]: b.doc_count }), {});
    return { ssmCounts };
  }),
  withSize(),
)(
  ({
    viewer: { explore } = {},
    exploreSsms,
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
            params={relay.route.params}
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
                      # of distinct (unique) Simple Somatic Mutations in the
                      Gene in {context}
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
                  isLoading={ssmCountsLoading}
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
          params={relay.route.params}
          total={!genes ? 0 : genes.hits.total}
        />
      </span>
    );
  },
);

export default createRenderer(Route, createContainer(Component));
