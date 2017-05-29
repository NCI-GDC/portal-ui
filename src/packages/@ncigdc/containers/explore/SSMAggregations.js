/* @flow */
/* eslint jsx-a11y/no-static-element-interactions: 0, max-len: 1 */

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
import { makeFilter } from "@ncigdc/utils/filters";
import NotMissingFacet from "@ncigdc/components/Aggregations/NotMissingFacet";

const presetFacets = [
  {
    title: "SSM ID",
    field: "ssm_id",
    full: "ssms.ssm_id",
    doc_type: "ssms",
    type: "id"
  },
  {
    title: "Impact (VEP)",
    field: "consequence.transcript.annotation.impact",
    full: "ssms.consequence.transcript.annotation.impact",
    doc_type: "ssms",
    type: "terms"
  },
  {
    title: "Consequence Type",
    field: "consequence.transcript.consequence_type",
    full: "ssms.consequence.transcript.consequence_type",
    doc_type: "ssms",
    type: "terms"
  },
  {
    title: "Mutation Type",
    field: "mutation_type",
    full: "ssms.mutation_type",
    doc_type: "ssms",
    type: "terms"
  },
  {
    title: "SSM Callers",
    field: "occurrence.case.observation.variant_calling.variant_caller",
    full: "ssms.occurrence.case.observation.variant_calling.variant_caller",
    doc_type: "ssms",
    type: "terms"
  },
  {
    title: "COSMIC ID",
    field: "cosmic_id",
    full: "ssms.cosmic_id",
    doc_type: "ssms",
    type: "notMissing"
  },
  {
    title: "dbSNP rs ID",
    field: "consequence.transcript.annotation.dbsnp_rs",
    full: "ssms.consequence.transcript.annotation.dbsnp_rs",
    doc_type: "ssms",
    type: "notMissing"
  }
];

export type TProps = {
  aggregations: {
    consequence__transcript__annotation__impact: { buckets: [TBucket] },
    consequence__transcript__consequence_type: { buckets: [TBucket] },
    mutation_type: { buckets: [TBucket] }
  },
  hits: {
    edges: Array<{|
      node: {|
        id: string
      |}
    |}>
  },
  setAutocomplete: Function,
  theme: Object,
  suggestions: Array
};

export const SSMAggregationsComponent = compose(
  withState("idCollapsed", "setIdCollapsed", false),
  withState("cosmicIdCollapsed", "setCosmicIdCollapsed", false),
  withState("dbSNPCollapsed", "setDbSNPCollapsed", false)
)((props: TProps) => (
  <div>
    <FacetHeader
      title="Mutation"
      field="ssms.ssm_id"
      collapsed={props.idCollapsed}
      setCollapsed={props.setIdCollapsed}
    />
    <SuggestionFacet
      title="Mutation"
      doctype="ssms"
      collapsed={props.idCollapsed}
      fieldNoDoctype="ssm_id"
      placeholder="Search for mutation id"
      hits={props.suggestions}
      // eslint-disable-next-line react/jsx-curly-spacing
      setAutocomplete={props.setAutocomplete}
      dropdownItem={x => (
        <span style={{ display: "flex" }}>
          <Column>
            <span style={{ fontWeight: "bold" }}>
              {x.ssm_id}
            </span>
          </Column>
        </span>
      )}
      style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
    />
    {presetFacets
      .filter(
        ({ full }) =>
          ![
            "ssms.ssm_id",
            "ssms.cosmic_id",
            "ssms.consequence.transcript.annotation.dbsnp_rs"
          ].includes(full)
      )
      .map(facet => (
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
    <FacetHeader
      title="COSMIC ID"
      field="ssms.cosmic_id"
      collapsed={props.cosmicIdCollapsed}
      setCollapsed={props.setCosmicIdCollapsed}
    />
    <NotMissingFacet
      field="ssms.cosmic_id"
      title="COSMIC ID"
      collapsed={props.cosmicIdCollapsed}
      notMissingDocCount={props.ssms.cosmic_id_not_missing.total}
      style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
    />
    <FacetHeader
      title="dbSNP rs ID"
      field="ssms.consequence.transcript.annotation.dbsnp_rs"
      collapsed={props.cosmicIdCollapsed}
      setCollapsed={props.setCosmicIdCollapsed}
    />
    <NotMissingFacet
      field="ssms.consequence.transcript.annotation.dbsnp_rs"
      title="dbSNP rs ID"
      collapsed={props.dbSNPCollapsed}
      notMissingDocCount={props.ssms.dbsnp_rs_not_missing.total}
      style={{ borderBottom: `1px solid ${props.theme.greyScale5}` }}
    />
  </div>
));

export const SSMAggregationsQuery = {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on SsmAggregations {
        consequence__transcript__annotation__impact {
          buckets {
            doc_count
            key
          }
        }
        consequence__transcript__consequence_type {
          buckets {
            doc_count
            key
          }
        }
        mutation_type {
          buckets {
            doc_count
            key
          }
        }
        occurrence__case__observation__variant_calling__variant_caller {
          buckets {
            doc_count
            key
          }
        }
      }
    `,
    ssms: () => Relay.QL`
      fragment on Ssms {
        cosmic_id_not_missing: hits(
          filters: { op: "and", content: [{ op: "not", content: { field: "cosmic_id", value: ["MISSING"] } }] }
        ) {
          total
        }
        dbsnp_rs_not_missing: hits(
          filters:
          {
            op: "and",
            content: [{
              op: "not", content: { field: "consequence.transcript.annotation.dbsnp_rs", value: ["MISSING"] }
            }]
          }
        ) {
          total
        }
      }
    `
  }
};

const SSMAggregations = Relay.createContainer(
  withTheme(SSMAggregationsComponent),
  SSMAggregationsQuery
);

export default SSMAggregations;
