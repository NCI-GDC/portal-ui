import React from 'react';
import {
  compose,
  branch,
  renderComponent,
  setDisplayName,
} from 'recompose';
import EntityPageVerticalTable from '@ncigdc/components/EntityPageVerticalTable';
import TableIcon from '@ncigdc/theme/icons/Table';
import MinusIcon from '@ncigdc/theme/icons/Minus';
import PlusIcon from '@ncigdc/theme/icons/Plus';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import { makeFilter } from '@ncigdc/utils/filters';

const GeneSummary = ({ viewer: { explore: { genes: { hits: { edges } } } } } = {}) => {
  const gene = edges[0].node;
  return (
    <EntityPageVerticalTable
      id="summary"
      style={{
        summary: {
          marginBottom: '2rem',
        },
        column: {
          width: '100%',
          minWidth: 450,
        },
        alignSelf: 'flex-start',
        width: '100%',
      }}
      thToTd={[
        {
          th: 'Symbol',
          td: gene.symbol,
        },
        {
          th: 'Name',
          td: gene.name,
        },
        {
          th: 'Synonyms',
          td:
            gene.synonyms.length &&
            gene.synonyms.map(s => <div key={s}>{s}</div>),
          style: {
            whiteSpace: 'pre-wrap',
            wordBreak: 'breakWord',
          },
        },
        {
          th: 'Type',
          td: gene.biotype,
        },
        {
          th: 'Location',
          td: `chr${gene.gene_chromosome}:${gene.gene_start}-${gene.gene_end} (GRCh38)`,
        },
        {
          th: 'Strand',
          td: gene.gene_strand && strandIconMap[gene.gene_strand.toString(10)],
        },
        {
          th: 'Description',
          collapsibleTd: gene.description,
          style: {
            whiteSpace: 'pre-wrap',
            wordBreak: 'breakWord',
            lineHeight: '2.2rem',
          },
        },
        {
          th: 'Annotation',
          td: gene.is_cancer_gene_census ? (
            <ExploreLink
              merge
              query={{
                searchTableTab: 'genes',
                filters: makeFilter([
                  {
                    field: 'genes.is_cancer_gene_census',
                    value: [gene.is_cancer_gene_census ? 'true' : 'false'],
                  },
                ]),
              }}
              >
              Cancer Gene Census
            </ExploreLink>
          ) : (
            '--'
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
};

const strandIconMap = {
  '-1': <MinusIcon />,
  1: <PlusIcon />,
};

export default compose(
  setDisplayName('EnhancedGeneSummary'),
  branch(
    ({ viewer }) => !viewer.explore.genes.hits.edges[0],
    renderComponent(() => <div>No gene found.</div>),
  ),
)(GeneSummary);
