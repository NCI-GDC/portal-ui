// @flow

import React from 'react';
import { scaleOrdinal, schemeCategory10 } from 'd3';
import { startCase, truncate, get } from 'lodash';

import styled from '@ncigdc/theme/styled';
import { Th, Td } from '@ncigdc/uikit/Table';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';
import { DNA_CHANGE_MARKERS } from '@ncigdc/utils/constants';
import GeneLink from '@ncigdc/components/Links/GeneLink';
import SparkMeter from '@ncigdc/uikit/SparkMeter';
import { tableToolTipHint } from '@ncigdc/theme/mixins';
import SurvivalIcon from '@ncigdc/theme/icons/SurvivalIcon';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { SpinnerIcon } from '@ncigdc/theme/icons';
import ProjectBreakdown from '@ncigdc/modern_components/ProjectBreakdown';
import BubbleIcon, { bubbleStyle } from '@ncigdc/theme/icons/BubbleIcon';
import MutationLink from '@ncigdc/components/Links/MutationLink';
import Hidden from '@ncigdc/components/Hidden';
import { getSurvivalCurves } from '@ncigdc/utils/survivalplot';
import Button from '@ncigdc/uikit/Button';
import { truncateAfterMarker } from '@ncigdc/utils/string';
import { ForTsvExport } from '@ncigdc/components/DownloadTableToTsvButton';
import { createSelectColumn } from '@ncigdc/tableModels/utils';
import { Row, Column } from '@ncigdc/uikit/Flex';
import { IMPACT_SHORT_FORMS } from '@ncigdc/utils/constants';

const colors = scaleOrdinal(schemeCategory10);
const Box = styled.div(bubbleStyle);

export const ImpactThContents = ({ theme }: { theme: Object }) => (
  <Tooltip
    style={tableToolTipHint()}
    Component={
      <Column>
        {['VEP', 'SIFT', 'PolyPhen'].map((impactType: string) => (
          <Row style={{ paddingTop: '5px' }} key={impactType}>
            <b style={{ textTransform: 'capitalize' }}>{impactType}</b>:{' '}
            {Object.entries(
              IMPACT_SHORT_FORMS[impactType.toLowerCase()],
            ).map(([full, short]) => (
              <div style={{ marginRight: '2px' }} key={full}>
                <Box
                  style={{
                    backgroundColor: theme[impactType.toLowerCase()][full],
                  }}
                >
                  {short}
                </Box>{' '}
                {full}
              </div>
            ))}
          </Row>
        ))}
      </Column>
    }
  >
    Impact
  </Tooltip>
);

export const ImpactTdContents = ({
  node,
  theme,
}: {
  node: {
    impact: string,
    sift_impact: string,
    sift_score: number,
    polyphen_score: number,
    polyphen_impact: string,
  },
  theme: Object,
}) => (
  <Row
    style={{
      display: 'flex',
      justifyContent: 'space-between',
    }}
  >
    {node.impact ? (
      <BubbleIcon
        toolTipText={`VEP Impact: ${node.impact}`}
        text={IMPACT_SHORT_FORMS.vep[(node.impact || '').toLowerCase()] || ''}
        backgroundColor={theme.impacts[node.impact]}
      />
    ) : (
      <span>--</span>
    )}
    {node.sift_impact ? (
      <BubbleIcon
        toolTipText={
          (node.sift_impact || '').length !== 0 &&
          `SIFT Impact: ${node.sift_impact} / SIFT score: ${node.sift_score}`
        }
        text={
          IMPACT_SHORT_FORMS.sift[(node.sift_impact || '').toLowerCase()] || ''
        }
        backgroundColor={theme.sift[node.sift_impact]}
      />
    ) : (
      <span>--</span>
    )}
    {node.polyphen_impact ? (
      <BubbleIcon
        toolTipText={
          (node.polyphen_impact || '').length !== 0 &&
          `PolyPhen Impact: ${node.polyphen_impact} / PolyPhen score: ${node.polyphen_score}`
        }
        text={
          IMPACT_SHORT_FORMS.polyphen[
            (node.polyphen_impact || '').toLowerCase()
          ] || ''
        }
        backgroundColor={theme.polyphen[node.polyphen_impact]}
      />
    ) : (
      <span>--</span>
    )}
    <ForTsvExport>
      {[
        `VEP: ${node.impact}`,
        ...(node.sift_impact
          ? [`Sift: ${node.sift_impact} - score ${node.sift_score}`]
          : []),
        ...(node.polyphen_impact
          ? [`Polyphen: ${node.polyphen_impact} - score ${node.polyphen_score}`]
          : []),
      ].join(', ')}
    </ForTsvExport>
  </Row>
);

const SsmsTableModel = [
  createSelectColumn({ idField: 'ssm_id' }),
  {
    name: 'Mutation ID',
    id: 'mutation_uuid',
    sortable: true,
    hidden: true,
    downloadable: true,
    th: () => <Th>Mutation ID</Th>,
    td: ({ node }) => (
      <Td>
        {node.ssm_id}
        <ForTsvExport>{node.ssm_id}</ForTsvExport>
      </Td>
    ),
  },
  {
    name: 'DNA Change',
    id: 'genomic_dna_change',
    sortable: true,
    downloadable: true,
    th: () => (
      <Th>
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
      </Th>
    ),
    td: ({ node }) => (
      <Td>
        <Tooltip
          Component={
            <div style={{ maxWidth: 300, wordBreak: 'break-all' }}>
              {node.genomic_dna_change}
            </div>
          }
        >
          <MutationLink uuid={node.ssm_id}>
            {truncateAfterMarker(
              node.genomic_dna_change,
              DNA_CHANGE_MARKERS,
              8,
            )}
          </MutationLink>
        </Tooltip>
      </Td>
    ),
  },
  {
    name: 'Type',
    id: 'mutation_subtype',
    sortable: true,
    downloadable: true,
    th: () => <Th>Type</Th>,
    td: ({ node }) => <Td>{node.mutation_subtype}</Td>,
  },
  {
    name: 'Consequences',
    id: 'consequence_type',
    sortable: true,
    downloadable: true,
    th: () => <Th>Consequences</Th>,
    td: ({ node, theme }) => (
      <Td>
        <span>
          <b>{startCase(node.consequenceType.replace('variant', ''))}</b>&nbsp;
          <GeneLink
            uuid={node.geneId}
            activeStyle={{
              textDecoration: 'none',
              color: theme.greyScale2,
              cursor: 'default',
            }}
          >
            {node.geneSymbol}
          </GeneLink>
          <Tooltip
            Component={
              <div style={{ maxWidth: 300, wordBreak: 'break-all' }}>
                {node.aaChange}
              </div>
            }
            style={{
              color: theme.impacts[node.impact] || 'inherit',
            }}
          >
            &nbsp;
            {truncate(node.aaChange, { length: 12 })}
          </Tooltip>
        </span>
      </Td>
    ),
  },
  {
    name: '# Affected Cases in Cohort',
    id: 'filteredCases',
    sortable: true,
    downloadable: true,
    th: ({ context }) => (
      <Th>
        <Tooltip
          Component={
            <span>
              # of Cases where Mutation is observed in {context}
              <br /> / # of Cases tested for Simple Somatic Mutations in{' '}
              {context}
            </span>
          }
          style={tableToolTipHint()}
        >
          # Affected Cases<br />in {context}
        </Tooltip>
      </Th>
    ),
    td: ({
      node,
      query,
      contextFilters,
      defaultFilters,
      filteredCases,
      location,
    }) => (
      <Td>
        <span>
          <ExploreLink
            merge
            query={{
              searchTableTab: 'cases',
              filters: addInFilters(
                query.genesTable_filters || contextFilters || defaultFilters,
                makeFilter([{ field: 'ssms.ssm_id', value: node.ssm_id }]),
              ),
            }}
          >
            {node.filteredOccurences.hits.total.toLocaleString()}
          </ExploreLink>
          <span> / </span>
          <ExploreLink
            query={{
              searchTableTab: 'cases',
              filters:
                location.pathname.split('/')[1] === 'genes'
                  ? query.ssmsTable_filters || contextFilters || defaultFilters
                  : addInFilters(
                      query.ssmsTable_filters ||
                        contextFilters ||
                        defaultFilters,
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
          <SparkMeter value={node.score / filteredCases.hits.total} />
          <span
            style={{
              fontSize: '0.8em',
              width: 40,
              display: 'inline-block',
            }}
          >
            {(node.score / filteredCases.hits.total * 100).toFixed(2)}%
          </span>
        </span>
      </Td>
    ),
  },
  {
    name: '	# Affected Cases Across the GDC',
    id: 'projectBreakdown',
    sortable: true,
    downloadable: true,
    th: () => (
      <Th>
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
      </Th>
    ),
    td: ({ node, cases }) => (
      <Td>
        <ProjectBreakdown
          filters={makeFilter([{ field: 'ssms.ssm_id', value: node.ssm_id }])}
          caseTotal={node.occurrence.hits.total}
          gdcCaseTotal={cases.hits.total}
        />
      </Td>
    ),
  },
  {
    name: 'Impact',
    id: 'impact',
    sortable: true,
    downloadable: true,
    th: ({ theme }) => <Th>{ImpactThContents({ theme })}</Th>,
    td: ({ node, theme }) => (
      <Td style={{ width: '90px', paddingRight: '5px' }}>
        {ImpactTdContents({ node, theme })}
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
              ? `Click icon to plot ${node.genomic_dna_change}`
              : 'Not enough survival data'
          }
        >
          <Button
            style={{
              padding: '2px 3px',
              backgroundColor: hasEnoughSurvivalDataOnPrimaryCurve
                ? colors(selectedSurvivalData.id === node.ssm_id ? 1 : 0)
                : '#666',
              color: 'white',
              margin: '0 auto',
            }}
            disabled={!hasEnoughSurvivalDataOnPrimaryCurve}
            onClick={() => {
              if (node.ssm_id !== selectedSurvivalData.id) {
                setSurvivalLoadingId(node.ssm_id);
                getSurvivalCurves({
                  field: 'gene.ssm.ssm_id',
                  value: node.ssm_id,
                  slug: `${get(
                    node,
                    'consequence.hits.edges[0].node.transcript.gene.symbol',
                  )} ${get(
                    node,
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
            {survivalLoadingId === node.ssm_id ? (
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

export default SsmsTableModel;
