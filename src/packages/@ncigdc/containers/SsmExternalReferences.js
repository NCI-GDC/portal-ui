// @flow

import React from 'react';
import Relay from 'react-relay/classic';
import { compose, withPropsOnChange } from 'recompose';
import externalReferenceLinks from '@ncigdc/utils/externalReferenceLinks';
import EntityPageVerticalTable from '@ncigdc/components/EntityPageVerticalTable';
import BookIcon from '@ncigdc/theme/icons/Book';
import { ExternalLink } from '@ncigdc/uikit/Links';
import CollapsibleList from '@ncigdc/uikit/CollapsibleList';

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
  dbSNP: string,
};

const SsmExternalReferencesComponent = compose(
  withPropsOnChange(['node'], ({ node }) => ({
    dbSNP: node.consequence.hits.edges.reduce(
      (acc, c) =>
        c.node.transcript.annotation.dbsnp_rs
          ? c.node.transcript.annotation.dbsnp_rs
          : acc,
      '',
    ),
  })),
)(({ node, dbSNP }: TProps = {}) =>
  <EntityPageVerticalTable
    data-test="external-references"
    title={
      <span>
        <BookIcon style={{ marginRight: '1rem' }} /> External References
      </span>
    }
    thToTd={[
      {
        th: <span style={{ textTransform: 'none' }}>dbSNP</span>,
        td: dbSNP && /rs(\d+)$/g.test(dbSNP)
          ? <ExternalLink
              href={externalReferenceLinks.dbsnp(dbSNP)}
              data-test="dbsnp-link"
            >
              {dbSNP}
            </ExternalLink>
          : '--',
      },
      {
        th: 'COSMIC',
        td: (node.cosmic_id || []).length
          ? <CollapsibleList
              style={{ minWidth: '300px' }}
              data={(node.cosmic_id || []).map(c =>
                <ExternalLink
                  data-test="cosmic-link"
                  href={externalReferenceLinks[c.substring(0, 4).toLowerCase()](
                    c.match(/(\d+)$/g),
                  )}
                >
                  {c}
                </ExternalLink>,
              )}
            />
          : '--',
      },
    ]}
    style={{ ...styles.summary, ...styles.column, alignSelf: 'flex-start' }}
  />,
);

export const SsmExternalReferencesQuery = {
  initialVariables: {
    withDbsnp_rs: {
      op: 'AND',
      content: [
        {
          op: 'NOT',
          content: {
            field: 'consequence.transcript.annotation.dbsnp_rs',
            value: 'MISSING',
          },
        },
      ],
    },
  },
  fragments: {
    node: () => Relay.QL`
      fragment on Ssm {
        cosmic_id
        consequence {
          hits(first: 1 filters: $withDbsnp_rs) {
            edges {
              node {
                transcript {
                  annotation {
                    dbsnp_rs
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

const SsmExternalReferences = Relay.createContainer(
  SsmExternalReferencesComponent,
  SsmExternalReferencesQuery,
);

export default SsmExternalReferences;
