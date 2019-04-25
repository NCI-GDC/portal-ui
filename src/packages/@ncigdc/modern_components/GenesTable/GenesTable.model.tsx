import React from 'react';
import { scaleOrdinal, schemeCategory10 } from 'd3';
import {
  Th, Td, ThNum, TdNum,
} from '@ncigdc/uikit/Table';
import {
  makeFilter,
  addInFilters,
  removeFilter,
  replaceFilters,
  removeFilterWithOp,
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
import ExploreSSMLink from '@ncigdc/components/Links/ExploreSSMLink';

import { ForTsvExport } from '@ncigdc/components/DownloadTableToTsvButton';
import { createSelectColumn } from '@ncigdc/tableModels/utils';
import {
  INodeProps,
  ITotalNumber,
} from '@ncigdc/modern_components/GenesTable/GenesTable';
import { IGroupFilter } from '@ncigdc/utils/filters/types';

interface IQueryProps {
  cases_sort: string;
  filters: string;
  searchTableTab: string;
  genesTable_filters?: IGroupFilter;
}

export interface ISelectedSurvivalDataProps {
  rawData?: {
    overallStats: { pValue?: number };
    results: Array<{
      donnors: Array<{
        project_id: string;
        censored: boolean;
        time: number;
        survivalEstimate: number;
        submitter_id: string;
      }>;
      meta: { id: number };
    }>;
  };
  id?: string;
  legend?: Array<{ key: string; value: string | JSX.Element }>;
}

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
    td: ({ node }: INodeProps) => <Td>{node.gene_id}</Td>,
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
      node: INodeProps['node'];
      defaultFilters: IGroupFilter;
    }) => {
      return (
        <Td>
          <GeneLink
            query={{
              filters: removeFilter(f => f.match(/^genes\./), defaultFilters),
            }}
            uuid={node.gene_id}>
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
    td: ({ node }: INodeProps) => (
      <Td>
        <div style={{
          maxWidth: '230px',
          whiteSpace: 'normal',
        }}>
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
    td: ({ node }: INodeProps) => <Td>{(node.cytoband || []).join(', ')}</Td>,
  },
  {
    name: 'Type',
    id: 'biotype',
    sortable: true,
    downloadable: true,
    hidden: true,
    th: () => <Th>Type</Th>,
    td: ({ node }: INodeProps) => <Td>{node.biotype}</Td>,
  },
  {
    name: '# SSM Affected Cases in Cohort',
    id: 'filteredCases',
    sortable: true,
    downloadable: true,
    th: ({ context }: { context: string }) => (
      <Th>
        <Tooltip
          Component={(
            <span>
              Breakdown of Affected Cases in
              {' '}
              {context}
              {' '}
              <br />
              # of Cases where Gene is
              {' '}
              <br />
              mutated /# Cases tested for Simple Somatic Mutations
            </span>
          )}
          style={tableToolTipHint()}>
          # SSM Affected Cases
          <br />
in
          {' '}
          {context}
        </Tooltip>
      </Th>
    ),
    td: ({
      node,
      query,
      defaultFilters,
      filteredCases,
    }: {
      node: INodeProps['node'];
      query: IQueryProps;
      defaultFilters: IGroupFilter;
      filteredCases: ITotalNumber;
    }) => (
      <Td>
        <span>
          <ExploreSSMLink
            filters={replaceFilters(
              {
                op: 'and',
                content: [
                  {
                    op: 'in',
                    content: {
                      field: 'genes.gene_id',
                      value: [node.gene_id],
                    },
                  },
                ],
              },
              query.genesTable_filters || defaultFilters
            )}
            merge
            searchTableTab="cases">
            {(node.numCases || 0).toLocaleString()}
          </ExploreSSMLink>
          <span> / </span>
          <ExploreLink
            query={{
              searchTableTab: 'cases',
              filters: removeFilterWithOp(
                (op: string, field: string) => op.match(/^NOT$/) && field.match(/^ssms.ssm_id/),
                addInFilters(
                  query.genesTable_filters || defaultFilters,
                  makeFilter([
                    {
                      field: 'cases.available_variation_data',
                      value: ['ssm'],
                    },
                  ])
                )
              ),
            }}>
            {(filteredCases.hits.total || 0).toLocaleString()}
          </ExploreLink>
          <span>
            {` (${((node.numCases || 0) /
            filteredCases.hits.total *
            100
            ).toFixed(2)}%)`}
          </span>
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
          Component={(
            <span>
              # of Cases where Gene contains Simple Somatic Mutations
              <br />
              / # Cases tested for Simple Somatic Mutations portal wide
              <br />
              Expand to see breakdown by project
            </span>
          )}
          style={tableToolTipHint()}>
          # SSM Affected Cases
          <br />
          {' '}
Across the GDC
        </Tooltip>
      </Th>
    ),
    td: ({
      node,
      cases,
    }: {
      node: INodeProps['node'];
      cases: ITotalNumber;
    }) => (
      <Td>
        <ProjectBreakdown
          caseTotal={node.ssm_case.hits.total}
          filters={makeFilter([
            {
              field: 'genes.gene_id',
              value: node.gene_id,
            },
          ])}
          gdcCaseTotal={cases.hits.total} />
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
          Component={(
            <span>
              # of Cases where CNV gain events are observed in Gene
              <br />
              / # of Cases tested for Copy Number Alteration in Gene
            </span>
          )}
          style={tableToolTipHint()}>
          # CNV Gain
        </Tooltip>
      </Th>
    ),
    td: ({
      node,
      query,
      defaultFilters,
      filteredCases,
      cnvCases,
    }: {
      node: INodeProps['node'];
      query: IQueryProps;
      defaultFilters: IGroupFilter;
      filteredCases: ITotalNumber;
      cnvCases: ITotalNumber;
    }) => (
      <Td>
        {cnvCases.hits.total ? (
          <span>
            {node.case_cnv_gain.hits && node.case_cnv_gain.hits.total !== 0
              ? node.case_cnv_gain.hits.total
              : 0}
            <span> / </span>
            {(cnvCases.hits.total || 0).toLocaleString()}
            <span>
              {` (${((node.case_cnv_gain.hits
              ? node.case_cnv_gain.hits.total
              : 0) /
              cnvCases.hits.total *
              100
              ).toFixed(2)}%)`}
            </span>
          </span>
        ) : (
          <span>--</span>
        )}
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
          Component={(
            <span>
              # of Cases where CNV loss events are observed in Gene
              <br />
              / # of Cases tested for Copy Number Alteration in Gene
            </span>
          )}
          style={tableToolTipHint()}>
          # CNV Loss
        </Tooltip>
      </Th>
    ),
    td: ({
      node,
      query,
      defaultFilters,
      filteredCases,
      cnvCases,
    }: {
      node: INodeProps['node'];
      query: IQueryProps;
      defaultFilters: IGroupFilter;
      filteredCases: ITotalNumber;
      cnvCases: ITotalNumber;
    }) => (
      <Td>
        {cnvCases.hits.total ? (
          <span>
            {node.case_cnv_loss.hits && node.case_cnv_loss.hits.total !== 0
              ? node.case_cnv_loss.hits.total
              : 0}
            <span> / </span>
            {(cnvCases.hits.total || 0).toLocaleString()}
            <span>
              {` (${((node.case_cnv_loss.hits
              ? node.case_cnv_loss.hits.total
              : 0) /
              cnvCases.hits.total *
              100
              ).toFixed(2)}%)`}
            </span>
          </span>
        ) : (
          <span>--</span>
        )}
      </Td>
    ),
  },
  {
    name: '# Mutations',
    id: 'mutations',
    sortable: true,
    downloadable: true,
    th: ({ context }: { context: string }) => (
      <ThNum>
        <Tooltip
          Component={(
            <span>
              # Unique Simple Somatic Mutations in the Gene
              {' '}
              {context ? (
                <span>
in
                  {context}
                </span>
) : ''}
            </span>
          )}
          style={tableToolTipHint()}>
          # Mutations
        </Tooltip>
      </ThNum>
    ),
    td: ({
      node,
      ssmCounts,
      defaultFilters,
    }: {
      node: INodeProps['node'];
      ssmCounts: { [x: string]: number };
      defaultFilters: IGroupFilter;
    }) => (
      <TdNum>
        <MutationsCount
          filters={addInFilters(
            defaultFilters,
            makeFilter([
              {
                field: 'genes.gene_id',
                value: [node.gene_id],
              },
            ])
          )}
          ssmCount={ssmCounts[node.gene_id]} />
      </TdNum>
    ),
  },
  {
    name: 'Annotations',
    id: 'annotations',
    sortable: true,
    downloadable: true,
    th: () => <Th style={{ textAlign: 'center' }}>Annotations</Th>,
    td: ({ node }: INodeProps) => (
      <Td style={{ textAlign: 'center' }}>
        {node.is_cancer_gene_census && (
          <span>
            <Tooltip Component="Cancer Gene Census">
              <CosmicIcon height="16px" width="20px" />
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
    }: {
      node: INodeProps['node'];
      hasEnoughSurvivalDataOnPrimaryCurve: boolean;
      selectedSurvivalData: ISelectedSurvivalDataProps;
      setSurvivalLoadingId: (id: string) => void;
      setSelectedSurvivalData: (data: ISelectedSurvivalDataProps) => void;
      survivalLoadingId: string;
      defaultFilters: IGroupFilter;
    }) => (
      <Td>
        <Tooltip
          Component={
            hasEnoughSurvivalDataOnPrimaryCurve
              ? `Click icon to plot ${node.symbol}`
              : 'Not enough survival data'
          }>
          <Button
            disabled={!hasEnoughSurvivalDataOnPrimaryCurve}
            onClick={() => {
              if (node.symbol !== selectedSurvivalData.id) {
                setSurvivalLoadingId(node.symbol);
                getSurvivalCurves({
                  field: 'gene.symbol',
                  value: node.symbol,
                  currentFilters: defaultFilters,
                  plotType: 'mutation',
                }).then((survivalData: ISelectedSurvivalDataProps) => {
                  setSelectedSurvivalData(survivalData);
                  setSurvivalLoadingId('');
                });
              } else {
                setSelectedSurvivalData({});
              }
            }}
            style={{
              padding: '2px 3px',
              backgroundColor: hasEnoughSurvivalDataOnPrimaryCurve
                ? colors(selectedSurvivalData.id === node.symbol ? '1' : '0')
                : '#666',
              color: 'white',
              margin: '0 auto',
            }}>
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
