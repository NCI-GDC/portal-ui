// @flow

import React from 'react';
import { compose, withPropsOnChange, branch, renderComponent } from 'recompose';
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

export default compose(
  branch(
    ({ viewer }) => !viewer.explore.ssms.hits.edges[0],
    renderComponent(() => <div>No ssm found.</div>),
  ),
  withPropsOnChange(
    ['viewer'],
    ({ viewer: { explore: { ssms: { hits: { edges } } } } }) => {
      const node = edges[0].node;
      return {
        dbSNP: node.consequence.hits.edges.reduce(
          (acc, c) =>
            c.node.transcript.annotation.dbsnp_rs
              ? c.node.transcript.annotation.dbsnp_rs
              : acc,
          '',
        ),
        node,
      };
    },
  ),
)(({ node, dbSNP } = {}) => (
  <EntityPageVerticalTable
    title={
      <span>
        <BookIcon style={{ marginRight: '1rem' }} /> External References
      </span>
    }
    thToTd={[
      {
        th: <span style={{ textTransform: 'none' }}>dbSNP</span>,
        td:
          dbSNP && /rs(\d+)$/g.test(dbSNP) ? (
            <ExternalLink href={externalReferenceLinks.dbsnp(dbSNP)}>
              {dbSNP}
            </ExternalLink>
          ) : (
            '--'
          ),
      },
      {
        th: 'COSMIC',
        td: (node.cosmic_id || []).length ? (
          <CollapsibleList
            style={{ minWidth: '300px' }}
            data={(node.cosmic_id || []).map(c => (
              <ExternalLink
                href={externalReferenceLinks[c.substring(0, 4).toLowerCase()](
                  c.match(/(\d+)$/g),
                )}
              >
                {c}
              </ExternalLink>
            ))}
          />
        ) : (
          '--'
        ),
      },
    ]}
    style={{ ...styles.summary, ...styles.column, alignSelf: 'flex-start' }}
  />
));
