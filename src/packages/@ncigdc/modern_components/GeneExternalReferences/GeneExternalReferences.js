import React from 'react';
import {
  branch,
  compose,
  renderComponent,
  setDisplayName,
  withProps,
} from 'recompose';
import { omit } from 'lodash';
import EntityPageVerticalTable from '@ncigdc/components/EntityPageVerticalTable';
import externalReferenceLinks, {
  externalLinkNames,
} from '@ncigdc/utils/externalReferenceLinks';
import { ExternalLink } from '@ncigdc/uikit/Links';
import BookIcon from '@ncigdc/theme/icons/Book';

type TProps = {
  node: Object,
  externalLinks: Object,
};

const GeneExternalReferences = ({ externalLinks }: TProps = {}) => (
  <EntityPageVerticalTable
    style={{ flex: 1 }}
    thToTd={Object.keys(externalLinks).map(db => ({
      td: externalLinks[db].length
        ? (
          <ExternalLink href={externalReferenceLinks[db](externalLinks[db][0])}>
            {externalLinks[db]}
          </ExternalLink>
        ) : '--',
      th: externalLinkNames[db] || db.replace(/_/, ' '),
    }))}
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
  setDisplayName('EnhancedGeneExternalReferences'),
  branch(
    ({ viewer }) => !viewer.explore.genes.hits.edges[0],
    renderComponent(() => <div>No gene found.</div>)
  ),
  withProps(({
    viewer: {
      explore: {
        genes: { hits: { edges } },
        ssms: { aggregations: { clinical_annotations__civic__gene_id: { buckets } } },
      },
    },
  } = {}) => {
    const gene = edges[0].node;
    const civic = buckets[0] ? [buckets[0].key] : [];

    return {
      externalLinks: {
        ...omit(gene.external_db_ids, '__dataID__'),
        ensembl: [gene.gene_id],
        civic, // non-alphabetical order, to match the requirement.
      },
    };
  })
)(GeneExternalReferences);
