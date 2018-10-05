// @flow

import React from 'react';
import { scaleOrdinal, schemeCategory10 } from 'd3';
import { Th, Td, ThNum, TdNum } from '@ncigdc/uikit/Table';
import {
  makeFilter,
  addInFilters,
  removeFilter,
  replaceFilters,
} from '@ncigdc/utils/filters';
import GeneLink from '@ncigdc/components/Links/GeneLink';
import { tableToolTipHint } from '@ncigdc/theme/mixins';
import SurvivalIcon from '@ncigdc/theme/icons/SurvivalIcon';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { SpinnerIcon } from '@ncigdc/theme/icons';
import ProjectBreakdown from '@ncigdc/modern_components/ProjectBreakdown';
import MutationsCount from '@ncigdc/components/MutationsCount';
import CosmicIcon from '@ncigdc/theme/icons/Cosmic';
import Hidden from '@ncigdc/components/Hidden';
import { getSurvivalCurves } from '@ncigdc/utils/survivalplot';
import Button from '@ncigdc/uikit/Button';

import { ForTsvExport } from '@ncigdc/components/DownloadTableToTsvButton';
import { createSelectColumn } from '@ncigdc/tableModels/utils';

import type { TGroupFilter } from '@ncigdc/utils/filters/types';

const colors = scaleOrdinal(schemeCategory10);

const GenesTableModel = [
  createSelectColumn({ idField: 'gene_id' }),
  {
    name: 'Gene ID',
    id: 'gene_id',
    sortable: true,
    downloadable: true,
    hidden: true,
    th: () => <Th>Gene ID</Th>,
    td: ({ node }) => <Td>{node.gene_id}</Td>,
  },
  {
    name: 'Symbol',
    id: 'symbol',
    sortable: true,
    downloadable: true,
    th: () => <Th>Symbol</Th>,
    td: ({
      node,
      defaultFilters,
    }: {
      node: Object,
      defaultFilters: TGroupFilter,
    }) => {
      return (
        <Td>
          <GeneLink
            uuid={node.gene_id}
            query={{
              filters: removeFilter(f => f.match(/^genes\./), defaultFilters),
            }}
          >
            {node.symbol}
          </GeneLink>
        </Td>
      );
    },
  },
  {
    name: 'Name',
    id: 'name',
    sortable: true,
    downloadable: true,
    th: () => <Th>Name</Th>,
    td: ({ node }) => (
      <Td>
        <div style={{ maxWidth: '230px', whiteSpace: 'normal' }}>
          {node.name}
        </div>
      </Td>
    ),
  },
  {
    name: 'Cytoband',
    id: 'cytoband',
    sortable: true,
    downloadable: true,
    hidden: true,
    th: () => <Th>Cytoband</Th>,
    td: ({ node }) => <Td>{(node.cytoband || []).join(', ')}</Td>,
  },
  {
    name: 'Type',
    id: 'biotype',
    sortable: true,
    downloadable: true,
    hidden: true,
    th: () => <Th>Type</Th>,
    td: ({ node }) => <Td>{node.biotype}</Td>,
  },
  {
    name: '# SSM Affected Cases in Cohort',
    id: 'filteredCases',
    sortable: true,
    downloadable: true,
    th: ({ context }) => (
      <Th>
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
          # SSM Affected Cases<br />in {context}
        </Tooltip>
      </Th>
    ),
    td: ({ node, query, defaultFilters, filteredCases }) => (
      <Td>
        <span>
          <ExploreLink
            merge
            query={{
              searchTableTab: 'cases',
              filters: replaceFilters(
                makeFilter([{ field: 'genes.gene_id', value: [node.gene_id] }]),
                query.genesTable_filters || defaultFilters,
              ),
            }}
          >
            {(node.numCases || 0).toLocaleString()}
          </ExploreLink>
          <span> / </span>
          <ExploreLink
            query={{
              searchTableTab: 'cases',
              filters: addInFilters(
                query.genesTable_filters || defaultFilters,
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
          <span>{` (${((node.numCases || 0) /
            filteredCases.hits.total *
            100
          ).toFixed(2)}%)`}</span>
        </span>
      </Td>
    ),
  },
  {
    name: '	# SSM Affected Cases Across the GDC',
    id: 'projectBreakdown',
    sortable: true,
    downloadable: true,
    th: () => (
      <Th>
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
          # SSM Affected Cases<br /> Across the GDC
        </Tooltip>
      </Th>
    ),
    td: ({ node, cases }) => (
      <Td>
        <ProjectBreakdown
          filters={makeFilter([
            { field: 'genes.gene_id', value: node.gene_id },
          ])}
          caseTotal={node.case.hits.total}
          gdcCaseTotal={cases.hits.total}
        />
      </Td>
    ),
  },
  {
    name: '# CNV Gain',
    id: 'cnvGain',
    sortable: true,
    downloadable: true,
    th: () => (
      <Th>
        <Tooltip
          Component={
            <span>
              # of Cases where CNV gain events are observed in Gene
              <br />
              / # of Cases tested for Copy Number Alteration in Gene
            </span>
          }
          style={tableToolTipHint()}
        >
          # CNV Gain
        </Tooltip>
      </Th>
    ),
    td: ({ node, query, defaultFilters, filteredCases }) => (
      <Td>
        <span>
          <ExploreLink
            merge
            query={{
              searchTableTab: 'cases',
              filters: replaceFilters(
                makeFilter([
                  {
                    field: 'genes.gene_id',
                    value: [node.gene_id],
                  },
                  {
                    field: 'Copy Number Variation',
                    value: ['Gain', 'High Level Amplification'],
                  },
                ]),
                query.genesTable_filters || defaultFilters,
              ),
            }}
          >
            {(Math.round(node.numCases / 2.5) || 0).toLocaleString()}
          </ExploreLink>
          <span> / </span>
          <ExploreLink
            query={{
              searchTableTab: 'cases',
              filters: addInFilters(
                // query.genesTable_filters || defaultFilters,
                makeFilter([
                  {
                    field: 'cases.available_variation_data',
                    value: ['cnv'],
                  },
                ]),
              ),
            }}
          >
            {(filteredCases.hits.total || 0).toLocaleString()}
          </ExploreLink>
          <span>{` (${((node.numCases / 2.5 || 0) /
            filteredCases.hits.total *
            100
          ).toFixed(2)}%)`}</span>
        </span>
      </Td>
    ),
  },
  {
    name: '# CNV Loss',
    id: 'cnvLoss',
    sortable: true,
    downloadable: true,
    th: () => (
      <Th>
        <Tooltip
          Component={
            <span>
              # of Cases where CNV loss events are observed in Gene
              <br />
              / # of Cases tested for Copy Number Alteration in Gene
            </span>
          }
          style={tableToolTipHint()}
        >
          # CNV Loss
        </Tooltip>
      </Th>
    ),
    td: ({ node, query, defaultFilters, filteredCases }) => (
      <Td>
        <span>
          <ExploreLink
            merge
            query={{
              searchTableTab: 'cases',
              filters: replaceFilters(
                makeFilter([
                  {
                    field: 'genes.gene_id',
                    value: [node.gene_id],
                  },
                  {
                    field: 'Copy Number Variation',
                    value: ['Shallow Loss', 'Deep Loss'],
                  },
                ]),
                query.genesTable_filters || defaultFilters,
              ),
            }}
          >
            {(Math.round(node.numCases / 3.5) || 0).toLocaleString()}
          </ExploreLink>
          <span> / </span>
          <ExploreLink
            query={{
              searchTableTab: 'cases',
              filters: addInFilters(
                query.genesTable_filters || defaultFilters,
                makeFilter([
                  {
                    field: 'cases.available_variation_data',
                    value: ['cnv'],
                  },
                ]),
              ),
            }}
          >
            {(filteredCases.hits.total || 0).toLocaleString()}
          </ExploreLink>
          <span>{` (${((Math.round(node.numCases / 3.5) || 0) /
            filteredCases.hits.total *
            100
          ).toFixed(2)}%)`}</span>
        </span>
      </Td>
    ),
  },
  {
    name: '# Mutations',
    id: 'mutations',
    sortable: true,
    downloadable: true,
    th: ({ context }) => (
      <ThNum>
        <Tooltip
          style={tableToolTipHint()}
          Component={
            <span>
              # Unique Simple Somatic Mutations in the Gene{' '}
              {context ? <span>in {context}</span> : ''}
            </span>
          }
        >
          # Mutations
        </Tooltip>
      </ThNum>
    ),
    td: ({ node, ssmCounts, defaultFilters }) => (
      <TdNum>
        <MutationsCount
          ssmCount={ssmCounts[node.gene_id]}
          filters={addInFilters(
            defaultFilters,
            makeFilter([{ field: 'genes.gene_id', value: [node.gene_id] }]),
          )}
        />
      </TdNum>
    ),
  },
  {
    name: 'Annotations',
    id: 'annotations',
    sortable: true,
    downloadable: true,
    th: () => <Th style={{ textAlign: 'center' }}>Annotations</Th>,
    td: ({ node }) => (
      <Td style={{ textAlign: 'center' }}>
        {node.is_cancer_gene_census && (
          <span>
            <Tooltip Component="Cancer Gene Census">
              <CosmicIcon width={'20px'} height={'16px'} />
            </Tooltip>
            <ForTsvExport>Cancer Gene Census</ForTsvExport>
          </span>
        )}
      </Td>
    ),
  },
  {
    name: 'Survival',
    id: 'survival_plot',
    th: () => <Th>Survival</Th>,
    td: ({
      node,
      hasEnoughSurvivalDataOnPrimaryCurve,
      selectedSurvivalData,
      setSurvivalLoadingId,
      setSelectedSurvivalData,
      survivalLoadingId,
      defaultFilters,
    }) => (
      <Td>
        <Tooltip
          Component={
            hasEnoughSurvivalDataOnPrimaryCurve
              ? `Click icon to plot ${node.symbol}`
              : 'Not enough survival data'
          }
        >
          <Button
            style={{
              padding: '2px 3px',
              backgroundColor: hasEnoughSurvivalDataOnPrimaryCurve
                ? colors(selectedSurvivalData.id === node.symbol ? 1 : 0)
                : '#666',
              color: 'white',
              margin: '0 auto',
            }}
            disabled={!hasEnoughSurvivalDataOnPrimaryCurve}
            onClick={() => {
              if (node.symbol !== selectedSurvivalData.id) {
                setSurvivalLoadingId(node.symbol);
                getSurvivalCurves({
                  field: 'gene.symbol',
                  value: node.symbol,
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
            {survivalLoadingId === node.symbol ? (
              <SpinnerIcon />
            ) : (
              <SurvivalIcon />
            )}
            <Hidden>add to survival plot</Hidden>
          </Button>
        </Tooltip>
      </Td>
    ),
  },
];

export default GenesTableModel;
