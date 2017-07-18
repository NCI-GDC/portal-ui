// @flow

import React from 'react';
import Relay from 'react-relay/classic';
import { compose, withPropsOnChange } from 'recompose';
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

type TProps = {
  node: Object,
  functionalImpact: string,
  functionalImpactTranscript: Object,
  theme: Object,
};

const SsmSummaryComponent = compose(
  withTheme,
  withPropsOnChange(['node'], ({ node }) => {
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
    };
  }),
)(
  (
    { node, functionalImpact, functionalImpactTranscript, theme }: TProps = {},
  ) =>
    <EntityPageVerticalTable
      data-test="ssm-summary"
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
                  data-test="functional-impact-bubble"
                  toolTipText={functionalImpact}
                  text={functionalImpact.slice(
                    0,
                    functionalImpact === 'MODIFIER' ? 2 : 1,
                  )}
                  backgroundColor={theme.impacts[functionalImpact]}
                />
                <span
                  data-test="functional-impact"
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
                  data-test="function-impact-transcript-link"
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

export const SsmSummaryQuery = {
  fragments: {
    node: () => Relay.QL`
      fragment on Ssm {
        ssm_id
        reference_allele
        mutation_subtype
        ncbi_build
        genomic_dna_change
        consequence {
          hits(first: 99) {
            edges {
              node {
                transcript {
                  transcript_id
                  annotation {
                    impact
                  }
                }
              }
            }
          }
        }
      }
    `,
  },
};

const SsmSummary = Relay.createContainer(SsmSummaryComponent, SsmSummaryQuery);

export default SsmSummary;
