import React from 'react';
import {
  branch,
  compose,
  renderComponent,
  setDisplayName,
  withPropsOnChange,
} from 'recompose';
import externalReferenceLinks from '@ncigdc/utils/externalReferenceLinks';
import EntityPageVerticalTable from '@ncigdc/components/EntityPageVerticalTable';
import BookIcon from '@ncigdc/theme/icons/Book';
import { ExternalLink } from '@ncigdc/uikit/Links';
import CollapsibleList from '@ncigdc/uikit/CollapsibleList';

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

const SSMExternalReferences = ({
  dbSNP,
  node: {
    clinical_annotations: {
      civic: {
        gene_id,
        variant_id,
      },
    },
    cosmic_id,
  },
} = {}) => (
  <EntityPageVerticalTable
    style={{
      ...styles.summary,
      ...styles.column,
      alignSelf: 'flex-start',
    }}
    thToTd={[
      {
        td:
          dbSNP && /rs(\d+)$/g.test(dbSNP)
            ? (
              <ExternalLink href={externalReferenceLinks.dbsnp(dbSNP)}>
                {dbSNP}
              </ExternalLink>
            ) : '--',
        th: <span style={{ textTransform: 'none' }}>dbSNP</span>,
      },
      {
        td: (cosmic_id || []).length ? (
          <CollapsibleList
            data={(cosmic_id || []).map(c => (
              <ExternalLink
                href={externalReferenceLinks[c.substring(0, 4).toLowerCase()](
                  c.match(/(\d+)$/g),
                )}
                key={c}
                >
                {c}
              </ExternalLink>
            ))}
            style={{ minWidth: '300px' }}
            />
        ) : '--',
        th: 'COSMIC',
      },
      {
        td:
          (gene_id && variant_id)
            ? (
              <ExternalLink href={externalReferenceLinks.civic(gene_id, variant_id)}>
                {variant_id}
              </ExternalLink>
            ) : '--',
        th: 'CIViC',
      },
    ]}
    title={(
      <span>
        <BookIcon style={{ marginRight: '1rem' }} />
        {' '}
        External References
      </span>
    )}
    />
);

export default compose(
  setDisplayName('SSMExternalReferences'),
  branch(
    ({ viewer }) => !viewer.explore.ssms.hits.edges[0],
    renderComponent(() => <div>No ssm found.</div>),
  ),
  withPropsOnChange(
    ['viewer'],
    ({ viewer: { explore: { ssms: { hits: { edges } } } } }) => {
      const { node } = edges[0];
      return {
        dbSNP: node.consequence.hits.edges.reduce(
          (acc, c) => (c.node.transcript.annotation.dbsnp_rs
              ? c.node.transcript.annotation.dbsnp_rs
              : acc),
          '',
        ),
        node,
      };
    },
  ),
)(SSMExternalReferences);
