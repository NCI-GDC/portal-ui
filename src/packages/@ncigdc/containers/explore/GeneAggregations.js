/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';
import _ from 'lodash';
import { compose, withState } from 'recompose';

import SuggestionFacet from '@ncigdc/components/Aggregations/SuggestionFacet';
import FacetWrapper from '@ncigdc/components/FacetWrapper';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';
import { IBucket } from '@ncigdc/components/Aggregations/types';
import { UploadGeneSet } from '@ncigdc/components/Modals/UploadSet';
import UploadSetButton from '@ncigdc/components/UploadSetButton';
import { withTheme } from '@ncigdc/theme';
import escapeForRelay from '@ncigdc/utils/escapeForRelay';

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
  setAutocomplete: Function,
  theme: Object,
  idCollapsed: boolean,
  setSsmIdCollapsed: Function,
  geneSymbolFragment: Object,
  suggestions: Object,
  relay: Object,
};

const presetFacets = [
  {
    title: 'Gene',
    field: 'gene_id',
    full: 'genes.gene_id',
    doc_type: 'genes',
    type: 'id',
  },
  {
    title: 'Biotype',
    field: 'biotype',
    full: 'genes.biotype',
    doc_type: 'genes',
    type: 'terms',
  },
  {
    title: 'Is Cancer Gene Census',
    field: 'is_cancer_gene_census',
    full: 'genes.is_cancer_gene_census',
    doc_type: 'genes',
    type: 'terms',
  },
];

export const GeneAggregationsComponent = compose(
  withState('idCollapsed', 'setIdCollapsed', false),
  withTheme,
)((props: TProps) => (
  <div className="test-gene-aggregations">
    <FacetHeader
      collapsed={props.idCollapsed}
      description="Enter Gene symbol, synonym, name or IDs for Ensembl, Entrez gene, HGNC Gene, OMIM, UniProtKB/Swiss-Prot"
      field="genes.gene_id"
      setCollapsed={props.setSsmIdCollapsed}
      title="Gene" />
    <SuggestionFacet
      collapsed={props.idCollapsed}
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
      geneSymbolFragment={props.geneSymbolFragment}
      hits={props.suggestions}
      placeholder="e.g. BRAF, ENSG00000157764"
      setAutocomplete={props.setAutocomplete}
      title="Gene" />

    <UploadSetButton
      defaultQuery={{
        pathname: '/exploration',
        query: { searchTableTab: 'genes' },
      }}
      idField="genes.gene_id"
      style={{
        width: '100%',
        borderBottom: `1px solid ${props.theme.greyScale5}`,
        padding: '0 1.2rem 1rem',
      }}
      type="gene"
      UploadModal={UploadGeneSet}>
      Upload Gene Set
    </UploadSetButton>

    {_.reject(presetFacets, { full: 'genes.gene_id' }).map(facet => (
      <FacetWrapper
        additionalProps={facet.additionalProps}
        aggregation={props.aggregations[escapeForRelay(facet.field)]}
        facet={facet}
        key={facet.full}
        relay={props.relay}
        style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
        title={facet.title} />
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
      aggregation={props.cnvAggregations[escapeForRelay('cnv_change')]}
      relay={props.relay}
      style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
    /> */}
  </div>
));

export const GeneAggregationsQuery = {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on GeneAggregations {
        biotype {
          buckets {
            doc_count
            key
          }
        }
        case__cnv__cnv_change {
          buckets {
            doc_count
            key
            key_as_string
          }
        }
        is_cancer_gene_census {
          buckets {
            doc_count
            key
            key_as_string
          }
        }
      }
    `,
    cnvAggregations: () => Relay.QL`
      fragment on CNVAggregations {
        cnv_change {
          buckets {
            doc_count
            key
            key_as_string
          }
        }
      }
    `,
  },
};

const GeneAggregations = Relay.createContainer(
  GeneAggregationsComponent,
  GeneAggregationsQuery,
);

export default GeneAggregations;
