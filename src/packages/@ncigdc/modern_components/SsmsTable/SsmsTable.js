/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import { compose, withState } from 'recompose';
import { orderBy, get } from 'lodash';
import { scaleOrdinal, schemeCategory10 } from 'd3';
import MutationLink from '@ncigdc/components/Links/MutationLink';
import { DNA_CHANGE_MARKERS } from '@ncigdc/utils/constants';
import withSize from '@ncigdc/utils/withSize';
import withBetterRouter from '@ncigdc/utils/withRouter';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';
import Showing from '@ncigdc/components/Pagination/Showing';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import BubbleIcon from '@ncigdc/theme/icons/BubbleIcon';
import { Row } from '@ncigdc/uikit/Flex';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import Button from '@ncigdc/uikit/Button';
import SparkMeter from '@ncigdc/uikit/SparkMeter';
import { tableToolTipHint } from '@ncigdc/theme/mixins';
import { SpinnerIcon } from '@ncigdc/theme/icons';
import Hidden from '@ncigdc/components/Hidden';
import Pagination from '@ncigdc/components/Pagination';
import SurvivalIcon from '@ncigdc/theme/icons/SurvivalIcon';
import { getSurvivalCurves } from '@ncigdc/utils/survivalplot';
import ProjectBreakdown from '@ncigdc/modern_components/ProjectBreakdown/ProjectBreakdown';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import { ForTsvExport } from '@ncigdc/components/DownloadTableToTsvButton';
import { withTheme } from '@ncigdc/theme';
import type { TTheme } from '@ncigdc/theme';
import type { TGroupFilter } from '@ncigdc/utils/filters/types';
import TableActions from '@ncigdc/components/TableActions';
import { truncateAfterMarker } from '@ncigdc/utils/string';

import mapData from './mapData';
const colors = scaleOrdinal(schemeCategory10);

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
    }: TProps = {},
  ) => {
    if (ssms && !ssms.hits.edges.length) {
      return <Row style={{ padding: '1rem' }}>No mutation data found.</Row>;
    }

    // Data has to be sorted because the relay cache does not store the order.
    const frequentMutations = mapData(
      ssms
        ? orderBy(
            ssms.hits.edges.map(x => x.node),
            ['score', 'ssm_id'],
            ['desc', 'asc'],
          )
        : [],
      theme,
    );

    const prefix = 'ssms';
    const totalSsms = ssms ? ssms.hits.total : 0;

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
              tsvSelector="#frequent-mutations-table"
              tsvFilename="frequent-mutations.tsv"
            />
          </Row>
        </Row>
        <EntityPageHorizontalTable
          idKey="ssm_id"
          tableId="frequent-mutations-table"
          headings={[
            {
              key: 'mutation_uuid',
              title: 'Mutation ID',
              style: { display: 'none' },
            },
            {
              key: 'genomic_dna_change',
              title: (
                <Tooltip
                  Component={
                    <span>
                      Genomic DNA change, shown as <br />
                      {'{chromosome}:g{start}{ref}>{tumor}'}
                    </span>
                  }
                  style={tableToolTipHint()}
                >
                  DNA Change
                </Tooltip>
              ),
              className: 'id-cell',
              style: { whiteSpace: 'normal' },
            },
            { key: 'mutation_subtype', title: 'Type' },
            { key: 'consequence_type', title: 'Consequences' },
            {
              key: 'filteredCases',
              style: {
                textAlign: 'right',
              },
              title: (
                <Tooltip
                  Component={
                    <span>
                      Breakdown of Cases Affected by Simple Somatic Mutations
                      in&nbsp;
                      {context}<br />
                      # of Cases where Mutation is observed / # of Cases tested
                      for Simple Somatic Mutations
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
              style: {
                textAlign: 'right',
              },
              title: (
                <Tooltip
                  Component={
                    <span>
                      # of Cases where Mutation is observed<br />
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
              key: 'impact',
              title: <span>Impact<br />(VEP)</span>,
              style: { textAlign: 'center' },
            },
            ...(showSurvivalPlot
              ? [
                  {
                    title: <span>Survival</span>,
                    key: 'survival_plot',
                    style: { textAlign: 'center', width: '100px' },
                  },
                ]
              : []),
          ]}
          data={frequentMutations.map(({ score = 0, ...x }) => ({
            ...x,
            mutation_uuid: (
              <ForTsvExport>
                {x.ssm_id}
              </ForTsvExport>
            ),
            genomic_dna_change: (
              <Tooltip
                Component={
                  <div style={{ maxWidth: 300, wordBreak: 'break-all' }}>
                    {x.genomic_dna_change}
                  </div>
                }
              >
                <MutationLink uuid={x.ssm_id}>
                  {truncateAfterMarker(
                    x.genomic_dna_change,
                    DNA_CHANGE_MARKERS,
                    8,
                  )}
                </MutationLink>
              </Tooltip>
            ),
            filteredCases: (
              <span>
                <ExploreLink
                  merge
                  query={{
                    searchTableTab: 'cases',
                    filters: addInFilters(
                      query.fmgTable_filters || defaultFilters,
                      makeFilter([{ field: 'ssms.ssm_id', value: x.ssm_id }]),
                    ),
                  }}
                >
                  {score.toLocaleString()}
                </ExploreLink>
                <span> / </span>
                <ExploreLink
                  query={{
                    searchTableTab: 'cases',
                    filters: location.pathname.split('/')[1] === 'genes'
                      ? query.ssmsTable_filters || defaultFilters
                      : addInFilters(
                          query.ssmsTable_filters || defaultFilters,
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
                <SparkMeter value={score / filteredCases.hits.total} />
                <span
                  style={{
                    fontSize: '0.8em',
                    width: 40,
                    display: 'inline-block',
                  }}
                >
                  {(score / filteredCases.hits.total * 100).toFixed(2)}%
                </span>
              </span>
            ),
            projectBreakdown: (
              <ProjectBreakdown
                filters={makeFilter([
                  { field: 'ssms.ssm_id', value: x.ssm_id },
                ])}
                caseTotal={x.occurrence.hits.total}
                gdcCaseTotal={cases.hits.total}
              />
            ),
            impact: !['LOW', 'MODERATE', 'HIGH', 'MODIFIER'].includes(x.impact)
              ? null
              : <span>
                  <BubbleIcon
                    toolTipText={x.impact}
                    text={x.impact.slice(0, x.impact === 'MODIFIER' ? 2 : 1)}
                    backgroundColor={theme.impacts[x.impact]}
                  />
                  <ForTsvExport>
                    {x.impact}
                  </ForTsvExport>
                </span>,
            ...(showSurvivalPlot
              ? {
                  survival_plot: (
                    <Tooltip
                      Component={
                        hasEnoughSurvivalDataOnPrimaryCurve
                          ? `Click icon to plot ${x.genomic_dna_change}`
                          : 'Not enough survival data'
                      }
                    >
                      <Button
                        style={{
                          padding: '2px 3px',
                          backgroundColor: hasEnoughSurvivalDataOnPrimaryCurve
                            ? colors(
                                selectedSurvivalData.id === x.ssm_id ? 1 : 0,
                              )
                            : '#666',
                          color: 'white',
                          margin: '0 auto',
                        }}
                        disabled={!hasEnoughSurvivalDataOnPrimaryCurve}
                        onClick={() => {
                          if (x.ssm_id !== selectedSurvivalData.id) {
                            setSurvivalLoadingId(x.ssm_id);
                            getSurvivalCurves({
                              field: 'gene.ssm.ssm_id',
                              value: x.ssm_id,
                              slug: `${get(
                                x,
                                'consequence.hits.edges[0].node.transcript.gene.symbol',
                              )} ${get(
                                x,
                                'consequence.hits.edges[0].node.transcript.aa_change',
                              )}`,
                              currentFilters: defaultFilters,
                            }).then(data => {
                              setSelectedSurvivalData(data);
                              setSurvivalLoadingId('');
                            });
                          } else {
                            setSelectedSurvivalData({});
                          }
                        }}
                      >
                        {survivalLoadingId === x.ssm_id
                          ? <SpinnerIcon />
                          : <SurvivalIcon />}
                        <Hidden>add to survival plot</Hidden>
                      </Button>
                    </Tooltip>
                  ),
                }
              : {}),
          }))}
        />
        <Pagination
          prefix="ssmsTable"
          params={variables}
          total={!ssms ? 0 : ssms.hits.total}
        />
      </span>
    );
  },
);
