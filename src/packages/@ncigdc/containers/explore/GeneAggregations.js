/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';
import _ from 'lodash';
import { compose, withState } from 'recompose';

import SuggestionFacet from '@ncigdc/components/Aggregations/SuggestionFacet';
import FacetWrapper from '@ncigdc/components/FacetWrapper';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';
import { TBucket } from '@ncigdc/components/Aggregations/types';
import { UploadGeneSet } from '@ncigdc/components/Modals/UploadSet';
import UploadSetButton from '@ncigdc/components/UploadSetButton';
import { withTheme } from '@ncigdc/theme';
import escapeForRelay from '@ncigdc/utils/escapeForRelay';

export type TProps = {
  aggregations: {
    biotype: { buckets: [TBucket] },
    is_cancer_gene_census: { buckets: [TBucket] },
    case__cnv__cnv_change: { buckets: [TBucket] },
  },
  cnvAggregations: {
    cnv_change: { buckets: [TBucket] },
  },
  hits: {
    edges: Array<{|
      node: {|
        id: string,
      |},
    |}>,
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
      title="Gene"
      field="genes.gene_id"
      collapsed={props.idCollapsed}
      setCollapsed={props.setSsmIdCollapsed}
      description={
        'Enter Gene symbol, synonym, name or IDs for Ensembl, Entrez gene, HGNC Gene, OMIM, UniProtKB/Swiss-Prot'
      }
    />
    <SuggestionFacet
      geneSymbolFragment={props.geneSymbolFragment}
      title="Gene"
      doctype="genes"
      collapsed={props.idCollapsed}
      fieldNoDoctype="gene_id"
      placeholder="e.g. BRAF, ENSG00000157764"
      hits={props.suggestions}
      setAutocomplete={props.setAutocomplete}
      dropdownItem={x => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{x.symbol}</div>
          {x.gene_id}
          <br />
          {x.name}
        </div>
      )}
    />

    <UploadSetButton
      type="gene"
      style={{
        width: '100%',
        borderBottom: `1px solid ${props.theme.greyScale5}`,
        padding: '0 1.2rem 1rem',
      }}
      UploadModal={UploadGeneSet}
      defaultQuery={{
        pathname: '/exploration',
        query: { searchTableTab: 'genes' },
      }}
      idField="genes.gene_id"
    >
      Upload Gene Set
    </UploadSetButton>

    {_.reject(presetFacets, { full: 'genes.gene_id' }).map(facet => (
      <FacetWrapper
        key={facet.full}
        facet={facet}
        title={facet.title}
        aggregation={props.aggregations[escapeForRelay(facet.field)]}
        relay={props.relay}
        additionalProps={facet.additionalProps}
        style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
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
