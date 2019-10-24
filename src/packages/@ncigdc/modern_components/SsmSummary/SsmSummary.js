// @flow

import React from 'react';
import {
  branch,
  compose,
  renderComponent,
  setDisplayName,
  withPropsOnChange,
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
  column: {
    minWidth: 450,
    width: '100%',
  },
  summary: {
    marginBottom: '2rem',
    minWidth: '450px',
  },
};

const SSMSummary = ({
  canonicalTranscript: {
    annotation: {
      polyphen_impact,
      polyphen_score,
      sift_impact,
      sift_score,
      vep_impact,
    },
    transcript_id,
  },
  node,
  theme,
} = {}) => (
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
        td: node.ssm_id,
        th: 'UUID',
      },
      {
        th: 'DNA change',
        td: (
          <span style={{
            whiteSpace: 'pre-line',
            wordBreak: 'break-all',
          }}
                >
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
            {transcript_id
              ? (
                <span>
                  <span>
                    <ExternalLink
                      data-test="function-impact-transcript-link"
                      href={externalReferenceLinks.ensembl(transcript_id)}
                      key={transcript_id}
                      style={{ paddingRight: '0.5em' }}
                      >
                      {transcript_id}
                    </ExternalLink>
                    <BubbleIcon
                      backgroundColor={theme.primary}
                      text="C"
                      toolTipText="Canonical"
                      />
                  </span>
                  <Row>
                    VEP:
                    {' '}
                    <span
                      style={{
                        display: 'inline-block',
                        marginLeft: '0.4em',
                        marginRight: '0.4em',
                      }}
                      >
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
              )
            : 'No canonical transcript'}
          </div>
        ),
      },
    ]}
    title={(
      <span>
        <TableIcon style={{ marginRight: '1rem' }} />
        Summary
      </span>
    )}
    />
);

export default compose(
  setDisplayName('EnhancedSSMSummary'),
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
          annotation: {},
          transcript_id: '',
        },
      });

      return {
        canonicalTranscript: transcript,
        node,
      };
    },
  ),
)(SSMSummary);
