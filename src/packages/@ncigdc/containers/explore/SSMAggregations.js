/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import { compose, withState } from 'recompose';

import SuggestionFacet from '@ncigdc/components/Aggregations/SuggestionFacet';
import FacetWrapper from '@ncigdc/components/FacetWrapper';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';

import type { TBucket } from '@ncigdc/components/Aggregations/types';

import { withTheme } from '@ncigdc/theme';
import escapeForRelay from '@ncigdc/utils/escapeForRelay';
import NotMissingFacet from '@ncigdc/components/Aggregations/NotMissingFacet';
import UploadSetButton from '@ncigdc/components/UploadSetButton';
import { UploadSsmSet } from '@ncigdc/components/Modals/UploadSet';

const presetFacets: Array<{
  title: string,
  field: string,
  full: string,
  doc_type: string,
  type: string,
  additionalProps?: {},
}> = [
  {
    title: 'SSM ID',
    field: 'ssm_id',
    full: 'ssms.ssm_id',
    doc_type: 'ssms',
    type: 'id',
  },
  {
    title: 'Impact (VEP)',
    field: 'consequence.transcript.annotation.impact',
    full: 'ssms.consequence.transcript.annotation.impact',
    doc_type: 'ssms',
    type: 'terms',
  },
  {
    title: 'Consequence Type',
    field: 'consequence.transcript.consequence_type',
    full: 'ssms.consequence.transcript.consequence_type',
    doc_type: 'ssms',
    type: 'terms',
  },
  {
    title: 'Type',
    field: 'mutation_subtype',
    full: 'ssms.mutation_subtype',
    doc_type: 'ssms',
    type: 'terms',
  },
  {
    title: 'Variant Caller',
    field: 'occurrence.case.observation.variant_calling.variant_caller',
    full: 'ssms.occurrence.case.observation.variant_calling.variant_caller',
    doc_type: 'ssms',
    type: 'terms',
  },
  {
    title: 'COSMIC ID',
    field: 'cosmic_id',
    full: 'ssms.cosmic_id',
    doc_type: 'ssms',
    type: 'notMissing',
  },
  {
    title: 'dbSNP rs ID',
    field: 'consequence.transcript.annotation.dbsnp_rs',
    full: 'ssms.consequence.transcript.annotation.dbsnp_rs',
    doc_type: 'ssms',
    type: 'notMissing',
  },
];

export type TProps = {
  aggregations: {
    consequence__transcript__annotation__impact: { buckets: [TBucket] },
    consequence__transcript__consequence_type: { buckets: [TBucket] },
    mutation_type: { buckets: [TBucket] },
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
  suggestions: Array<{}>,
  idCollapsed: boolean,
  setIdCollapsed: Function,
  cosmicIdCollapsed: boolean,
  setCosmicIdCollapsed: boolean,
  relay: {},
  ssms: {
    cosmic_id_not_missing: {
      total: number,
    },
    dbsnp_rs_not_missing: {
      total: number,
    },
  },
  dbSNPCollapsed: boolean,
  setDbSNPCollapsed: Function,
};

export const SSMAggregationsComponent = compose(
  withState('idCollapsed', 'setIdCollapsed', false),
  withState('cosmicIdCollapsed', 'setCosmicIdCollapsed', false),
  withState('dbSNPCollapsed', 'setDbSNPCollapsed', false),
)((props: TProps) => (
  <div className="test-ssm-aggregations">
    <FacetHeader
      title="Mutation"
      field="ssms.ssm_id"
      collapsed={props.idCollapsed}
      setCollapsed={props.setIdCollapsed}
      description="Enter Mutation UUID, DNA Change, Gene AA Change, COSMIC ID or dbSNP rs ID"
    />
    <SuggestionFacet
      title="Mutation"
      doctype="ssms"
      collapsed={props.idCollapsed}
      fieldNoDoctype="ssm_id"
      placeholder="e.g. BRAF V600E, chr7:g.140753336A>T"
      hits={props.suggestions}
      setAutocomplete={props.setAutocomplete}
      dropdownItem={x => <div style={{ fontWeight: 'bold' }}>{x.ssm_id}</div>}
    />
    <UploadSetButton
      type="ssm"
      displayType="mutation"
      style={{
        width: '100%',
        borderBottom: `1px solid ${props.theme.greyScale5}`,
        padding: '0 1.2rem 1rem',
      }}
      UploadModal={UploadSsmSet}
      defaultQuery={{
        pathname: '/exploration',
        query: { searchTableTab: 'ssms' },
      }}
      idField="ssms.ssm_id"
    >
      Upload Mutation Set
    </UploadSetButton>
    {presetFacets
      .filter(
        ({ full }) =>
          ![
            'ssms.ssm_id',
            'ssms.cosmic_id',
            'ssms.consequence.transcript.annotation.dbsnp_rs',
          ].includes(full),
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
        mutation_subtype {
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
  },
};

const SSMAggregations = Relay.createContainer(
  withTheme(SSMAggregationsComponent),
  SSMAggregationsQuery,
);

export default SSMAggregations;
