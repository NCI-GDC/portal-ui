/* @flow */

import React from "react";
import Relay from "react-relay/classic";
import _ from "lodash";
import { compose, withState } from "recompose";

import SuggestionFacet from "@ncigdc/components/Aggregations/SuggestionFacet";
import FacetWrapper from "@ncigdc/components/FacetWrapper";
import FacetHeader from "@ncigdc/components/Aggregations/FacetHeader";

import type { TBucket } from "@ncigdc/components/Aggregations/types";

import { withTheme } from "@ncigdc/theme";
import { Column } from "@ncigdc/uikit/Flex";
import escapeForRelay from "@ncigdc/utils/escapeForRelay";

export type TProps = {
  aggregations: {
    biotype: { buckets: [TBucket] },
    is_cancer_gene_census: { buckets: [TBucket] }
  },
  hits: {
    edges: Array<{|
      node: {|
        id: string
      |}
    |}>
  },
  setAutocomplete: Function,
  theme: Object
};

const presetFacets = [
  {
    title: "Gene",
    field: "gene_id",
    full: "genes.gene_id",
    doc_type: "genes",
    type: "id"
  },
  {
    title: "Type",
    field: "biotype",
    full: "genes.biotype",
    doc_type: "genes",
    type: "terms"
  },
  {
    title: "Curated Gene Set",
    field: "is_cancer_gene_census",
    full: "genes.is_cancer_gene_census",
    doc_type: "genes",
    type: "terms"
  }
];

export const GeneAggregationsComponent = compose(
  withState("idCollapsed", "setIdCollapsed", false)
)((props: TProps) => (
  <div>
    <FacetHeader
      title="Gene"
      field="genes.symbol"
      collapsed={props.idCollapsed}
      setCollapsed={props.setSsmIdCollapsed}
    />
    <SuggestionFacet
      title="Gene"
      doctype="genes"
      collapsed={props.idCollapsed}
      fieldNoDoctype="gene_id"
      placeholder="Search for Gene Symbol or ID"
      hits={props.suggestions}
      setAutocomplete={props.setAutocomplete}
      dropdownItem={x => (
        <span style={{ display: "flex" }}>
          <Column>
            <span style={{ fontWeight: "bold" }}>
              {x.symbol}
            </span>
            <span>
              {x.gene_id}
            </span>
            {x.name}
          </Column>
        </span>
      )}
      style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
    />
    {_.reject(presetFacets, { full: "genes.gene_id" }).map(facet => (
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
        is_cancer_gene_census  {
          buckets {
            doc_count
            key
          }
        }
      }
    `
  }
};

const GeneAggregations = Relay.createContainer(
  withTheme(GeneAggregationsComponent),
  GeneAggregationsQuery
);

export default GeneAggregations;
