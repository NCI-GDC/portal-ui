// @flow

import React from 'react';
import { compose, withPropsOnChange, branch, renderComponent } from 'recompose';
import { get } from 'lodash';
import EntityPageVerticalTable from '@ncigdc/components/EntityPageVerticalTable';
import TableIcon from '@ncigdc/theme/icons/Table';
import BubbleIcon from '@ncigdc/theme/icons/BubbleIcon';
import { withTheme } from '@ncigdc/theme';
import externalReferenceLinks from '@ncigdc/utils/externalReferenceLinks';
import { ExternalLink } from '@ncigdc/uikit/Links';

const styles = {
  summary: {
    marginBottom: '2rem',
    minWidth: '450px',
  },
  column: {
    width: '100%',
    minWidth: 450,
  },
};

export default compose(
  branch(
    ({ viewer }) => !viewer.explore.ssms.hits.edges[0],
    renderComponent(() => <div>No ssm found.</div>),
  ),
  withTheme,
  withPropsOnChange(
    ['viewer'],
    ({ viewer: { explore: { ssms: { hits: { edges } } } } }) => {
      const node = edges[0].node;
      const consequences = node.consequence.hits.edges;

      const consequenceOfInterest = consequences.find(
        consequence => get(consequence, 'node.transcript.annotation.impact'),
        {},
      );

      const functionalImpactTranscript = get(
        consequenceOfInterest,
        'node.transcript',
        {},
      );

      const functionalImpact = get(
        functionalImpactTranscript,
        'annotation.impact',
      );

      return {
        functionalImpact,
        functionalImpactTranscript,
        node,
      };
    },
  ),
)(({ node, functionalImpact, functionalImpactTranscript, theme } = {}) =>
  <EntityPageVerticalTable
    id="Summary"
    title={<span><TableIcon style={{ marginRight: '1rem' }} />Summary</span>}
    thToTd={[
      { th: 'ID', td: node.ssm_id },
      {
        th: 'DNA change',
        td: (
          <span style={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>
            {node.genomic_dna_change}
          </span>
        ),
      },
      { th: 'Type', td: node.mutation_subtype },
      { th: 'Reference genome assembly', td: node.ncbi_build || '' },
      {
        th: 'Allele in the reference assembly',
        td: node.reference_allele || '',
      },
      {
        th: 'Functional Impact (VEP)',
        td:
          functionalImpact &&
            <div>
              <BubbleIcon
                toolTipText={functionalImpact}
                text={functionalImpact.slice(
                  0,
                  functionalImpact === 'MODIFIER' ? 2 : 1,
                )}
                backgroundColor={theme.impacts[functionalImpact]}
              />
              <span
                style={{
                  display: 'inline-block',
                  textTransform: 'capitalize',
                  marginLeft: '0.4em',
                  marginRight: '0.4em',
                }}
              >
                {functionalImpact.toLowerCase()}
              </span>
              <ExternalLink
                key={functionalImpactTranscript.transcript_id}
                style={{ paddingRight: '0.5em' }}
                href={externalReferenceLinks.ensembl(
                  functionalImpactTranscript.transcript_id,
                )}
              >
                {functionalImpactTranscript.transcript_id}
              </ExternalLink>
            </div>,
        style: { textTransform: 'capitalize' },
      },
    ]}
    style={{
      ...styles.summary,
      ...styles.column,
      alignSelf: 'flex-start',
    }}
  />,
);
