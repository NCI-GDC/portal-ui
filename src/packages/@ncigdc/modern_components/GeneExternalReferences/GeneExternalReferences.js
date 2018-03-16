import React from 'react';
import { compose, withProps, branch, renderComponent } from 'recompose';
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

export default compose(
  branch(
    ({ viewer }) => !viewer.explore.genes.hits.edges[0],
    renderComponent(() => <div>No gene found.</div>),
  ),
  withProps(({ viewer: { explore: { genes: { hits: { edges } } } } } = {}) => {
    const gene = edges[0].node;

    return {
      externalLinks: {
        ...omit(gene.external_db_ids, '__dataID__'),
        ensembl: [gene.gene_id],
      },
    };
  }),
)(({ externalLinks }: TProps = {}) => (
  <EntityPageVerticalTable
    title={
      <span>
        <BookIcon style={{ marginRight: '1rem' }} /> External References
      </span>
    }
    thToTd={Object.keys(externalLinks).map(db => ({
      th: externalLinkNames[db] || db.replace(/_/, ' '),
      td: externalLinks[db].length ? (
        <ExternalLink href={externalReferenceLinks[db](externalLinks[db][0])}>
          {externalLinks[db]}
        </ExternalLink>
      ) : (
        '--'
      ),
    }))}
    style={{ flex: 1 }}
  />
));
