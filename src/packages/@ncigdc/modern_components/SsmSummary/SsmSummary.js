// @flow

import React from 'react';
import {
  compose, withPropsOnChange, branch, renderComponent,
} from 'recompose';
import { get } from 'lodash';
import EntityPageVerticalTable from '@ncigdc/components/EntityPageVerticalTable';
import TableIcon from '@ncigdc/theme/icons/Table';
import { withTheme } from '@ncigdc/theme';
import externalReferenceLinks from '@ncigdc/utils/externalReferenceLinks';
import { ExternalLink } from '@ncigdc/uikit/Links';
import { Row } from '@ncigdc/uikit/Flex';
import BubbleIcon from '@ncigdc/theme/icons/BubbleIcon';

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
      const { node } = edges[0];

      const { transcript } = get(node, 'consequence.hits.edges[0].node', {
        transcript: {
          transcript_id: '',
          annotation: {},
        },
      });

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
          vep_impact,
        },
      },
      theme,
    } = {},
  ) => (
    <EntityPageVerticalTable
      data-test="ssm-summary"
      id="Summary"
      style={{
        ...styles.summary,
        ...styles.column,
        alignSelf: 'flex-start',
      }}
      thToTd={[
        {
          th: 'UUID',
          td: node.ssm_id,
        },
        {
          th: 'DNA change',
          td: (
            <span style={{
              whiteSpace: 'pre-line',
              wordBreak: 'break-all',
            }}>
              {node.genomic_dna_change}
            </span>
          ),
        },
        {
          th: 'Type',
          td: node.mutation_subtype,
        },
        {
          th: 'Reference genome assembly',
          td: node.ncbi_build || '',
        },
        {
          th: 'Allele in the reference assembly',
          td: node.reference_allele || '',
        },
        {
          th: 'Functional Impact',
          td: (
            <div>
              {!transcript_id && 'No canonical transcript'}
              {transcript_id && (
                <span>
                  <span>
                    <ExternalLink
                      data-test="function-impact-transcript-link"
                      href={externalReferenceLinks.ensembl(transcript_id)}
                      key={transcript_id}
                      style={{ paddingRight: '0.5em' }}>
                      {transcript_id}
                    </ExternalLink>
                    <BubbleIcon
                      backgroundColor={theme.primary}
                      text="C"
                      toolTipText="Canonical" />
                  </span>
                  <Row>
                    VEP:
                    {' '}
                    <span
                      style={{
                        display: 'inline-block',
                        marginLeft: '0.4em',
                        marginRight: '0.4em',
                      }}>
                      {vep_impact}
                    </span>
                  </Row>
                  {sift_impact && (
                    <Row>
                      SIFT:
                      {' '}
                      {sift_impact}
, score:
                      {' '}
                      {sift_score}
                    </Row>
                  )}
                  {polyphen_impact && (
                    <Row>
                      PolyPhen:
                      {' '}
                      {polyphen_impact}
, score:
                      {' '}
                      {polyphen_score}
                    </Row>
                  )}
                </span>
              )}
            </div>
          ),
        },
      ]}
      title={(
        <span>
          <TableIcon style={{ marginRight: '1rem' }} />
Summary
        </span>
      )} />
  ),
);
