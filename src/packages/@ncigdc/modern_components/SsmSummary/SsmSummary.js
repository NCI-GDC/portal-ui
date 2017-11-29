// @flow

import React from 'react';
import { compose, withPropsOnChange, branch, renderComponent } from 'recompose';
import { get } from 'lodash';
import EntityPageVerticalTable from '@ncigdc/components/EntityPageVerticalTable';
import TableIcon from '@ncigdc/theme/icons/Table';
import { withTheme } from '@ncigdc/theme';
import externalReferenceLinks from '@ncigdc/utils/externalReferenceLinks';
import { ExternalLink } from '@ncigdc/uikit/Links';
import { Row } from '@ncigdc/uikit/Flex';

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

      const { transcript } = get(node, 'consequence.hits.edges[0].node');

      return {
        canonicalTranscript: transcript,
        node,
      };
    },
  ),
)(
  (
    {
      node,
      canonicalTranscript: {
        transcript_id,
        annotation: {
          polyphen_impact,
          polyphen_score,
          sift_score,
          sift_impact,
          impact,
        },
      },
      theme,
    } = {},
  ) => (
    <EntityPageVerticalTable
      data-test="ssm-summary"
      id="Summary"
      title={
        <span>
          <TableIcon style={{ marginRight: '1rem' }} />Summary
        </span>
      }
      thToTd={[
        { th: 'UUID', td: node.ssm_id },
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
          th: 'Functional Impact',
          td: (
            <div>
              <ExternalLink
                data-test="function-impact-transcript-link"
                key={transcript_id}
                style={{ paddingRight: '0.5em' }}
                href={externalReferenceLinks.ensembl(transcript_id)}
              >
                {transcript_id}
              </ExternalLink>
              <Row>
                VEP:{' '}
                <span
                  style={{
                    display: 'inline-block',
                    marginLeft: '0.4em',
                    marginRight: '0.4em',
                  }}
                >
                  {impact && impact.toLowerCase()}
                </span>
              </Row>
              <Row>
                Polyphen: {polyphen_impact}, score: {polyphen_score}
              </Row>
              <Row>
                Sift: {sift_impact}, score: {sift_score}
              </Row>
            </div>
          ),
        },
      ]}
      style={{
        ...styles.summary,
        ...styles.column,
        alignSelf: 'flex-start',
      }}
    />
  ),
);
