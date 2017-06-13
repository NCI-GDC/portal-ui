// @flow
import React from 'react';
import { startCase, truncate, get } from 'lodash';
import GeneLink from '@ncigdc/components/Links/GeneLink';
import { Tooltip } from '@ncigdc/uikit/Tooltip';

const mutationSubTypeMap = {
  'single base substitution': 'Substitution',
  'small deletion': 'Deletion',
  'small insertion': 'Insertion',
};

type TMapData = (
  data: Array<Object>,
  shouldShowGeneSymbol: boolean,
  theme: Object,
) => Array<Object>;

const mapData: TMapData = (data, shouldShowGeneSymbol, theme) =>
  data.map(hit => {
    const consequenceOfInterest =
      hit.consequence.hits.edges.find(
        consequence => get(consequence, 'node.transcript.annotation.impact'),
        {},
      ) || {};
    const { transcript } = consequenceOfInterest.node || {};
    const {
      annotation = {},
      consequence_type: consequenceType = '',
      gene = {},
      aa_change: aaChange,
    } =
      transcript || {};
    const { symbol, gene_id: geneId } = gene;
    const impact = annotation.impact;

    return {
      ...hit,
      impact,
      mutation_subtype:
        mutationSubTypeMap[(hit.mutation_subtype || '').toLowerCase()] ||
          hit.mutation_subtype,
      consequence_type: (
        <span>
          <b>{startCase(consequenceType.replace('variant', ''))}</b>&nbsp;
          {shouldShowGeneSymbol && <GeneLink uuid={geneId}>{symbol}</GeneLink>}
          <Tooltip
            Component={
              <div style={{ maxWidth: 300, wordBreak: 'break-all' }}>
                {aaChange}
              </div>
            }
            style={{
              color: theme.impacts[impact] || 'inherit',
            }}
          >
            &nbsp;
            {truncate(aaChange, { length: 12 })}
          </Tooltip>
        </span>
      ),
    };
  });

export default mapData;
