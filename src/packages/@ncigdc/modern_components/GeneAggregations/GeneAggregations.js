/* @flow */
import React from 'react';
// import Relay from 'react-relay/classic';
import _ from 'lodash';
import { compose, withState } from 'recompose';

// import SuggestionFacet from '@ncigdc/components/Aggregations/SuggestionFacet';
import SuggestionFacet from '@ncigdc/modern_components/SuggestionFacet';

import FacetWrapper from '@ncigdc/components/FacetWrapper';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';
// import { IBucket } from '@ncigdc/components/Aggregations/types';
import { UploadGeneSet } from '@ncigdc/components/Modals/UploadSet';
import UploadSetButton from '@ncigdc/components/UploadSetButton';
import { withTheme } from '@ncigdc/theme';
import escapeForRelay from '@ncigdc/utils/escapeForRelay';
// import { makeFilter } from '@ncigdc/utils/filters';

export type TProps = {
  aggregations: {
    biotype: { buckets: [IBucket] },
    is_cancer_gene_census: { buckets: [IBucket] },
    case__cnv__cnv_change: { buckets: [IBucket] },
  },
  cnvAggregations: {
    cnv_change: { buckets: [IBucket] },
  },
  hits: {
    edges: Array<{
      node: {
        id: string,
      },
    }>,
  },
  theme: Object,
  idCollapsed: boolean,
  setSsmIdCollapsed: Function,
  geneSymbolFragment: Object,
  relay: Object,
};

const presetFacets = [
  {
    doc_type: 'genes',
    field: 'gene_id',
    full: 'genes.gene_id',
    title: 'Gene',
    type: 'id',
  },
  {
    doc_type: 'genes',
    field: 'biotype',
    full: 'genes.biotype',
    title: 'Biotype',
    type: 'terms',
  },
  {
    doc_type: 'genes',
    field: 'is_cancer_gene_census',
    full: 'genes.is_cancer_gene_census',
    title: 'Is Cancer Gene Census',
    type: 'terms',
  },
];

export const GeneAggregations = compose(
  withState('idCollapsed', 'setIdCollapsed', false),
  withTheme,
)(({
  geneSymbolFragment,
  idCollapsed,
  relay,
  setSsmIdCollapsed,
  theme,
  viewer: { explore: { genes: { aggregations } } },
}: TProps) => {
  return (
    <div className="test-gene-aggregations">
      <FacetHeader
      collapsed={idCollapsed}
      description="Enter Gene symbol, synonym, name or IDs for Ensembl, Entrez gene, HGNC Gene, OMIM, UniProtKB/Swiss-Prot"
      field="genes.gene_id"
      setCollapsed={setSsmIdCollapsed}
      title="Gene"
      />
      <SuggestionFacet
        collapsed={idCollapsed}
        doctype="genes"
        dropdownItem={x => (
          <div>
            <div style={{ fontWeight: 'bold' }}>{x.symbol}</div>
            {x.gene_id}
            <br />
            {x.name}
          </div>
        )}
        fieldNoDoctype="gene_id"
        geneSymbolFragment={geneSymbolFragment}
        placeholder="e.g. BRAF, ENSG00000157764"
        queryType="gene_centric"
        title="Gene"
        />
      <UploadSetButton
        defaultQuery={{
          pathname: '/exploration',
          query: {
            searchTableTab: 'genes',
          },
        }}
        idField="genes.gene_id"
        style={{
          width: '100%',
          borderBottom: `1px solid ${theme.greyScale5}`,
          padding: '0 1.2rem 1rem',
        }}
        type="gene"
        UploadModal={UploadGeneSet}
        >
      Upload Gene Set
      </UploadSetButton>

      {_.reject(presetFacets, { full: 'genes.gene_id' }).map(facet => (
        <FacetWrapper
        additionalProps={facet.additionalProps}
        aggregation={aggregations[escapeForRelay(facet.field)]}
        facet={facet}
        key={facet.full}
        relay={relay}
        style={{ borderBottom: `1px solid ${theme.greyScale5}` }}
        title={facet.title}
        />
      ))}
      {/* <FacetWrapper
      key={'cnvs.cnv_change'}
      facet={{
        title: 'CNV',
        field: 'cnv_change',
        full: 'cnvs.cnv_change',
        doc_type: 'cnvs',
        type: 'terms',
      }}
      title={'CNV'}
      aggregation={cnvAggregations[escapeForRelay('cnv_change')]}
      relay={relay}
      style={{ borderBottom: `1px solid ${theme.greyScale5}` }}
    /> */}
    </div>
  );
});

// export const GeneAggregationsQuery = {
//   fragments: {
//     aggregations: () => Relay.QL`
//       fragment on GeneAggregations {
//         biotype {
//           buckets {
//             doc_count
//             key
//           }
//         }
//         case__cnv__cnv_change {
//           buckets {
//             doc_count
//             key
//             key_as_string
//           }
//         }
//         is_cancer_gene_census {
//           buckets {
//             doc_count
//             key
//             key_as_string
//           }
//         }
//       }
//     `,
//     cnvAggregations: () => Relay.QL`
//       fragment on CNVAggregations {
//         cnv_change {
//           buckets {
//             doc_count
//             key
//             key_as_string
//           }
//         }
//       }
//     `,
//   },
// };

// const GeneAggregations = Relay.createContainer(
//   GeneAggregationsComponent,
//   GeneAggregationsQuery,
// );

export default GeneAggregations;
