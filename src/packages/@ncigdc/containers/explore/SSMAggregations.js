/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import { compose, withState } from 'recompose';

import SuggestionFacet from '@ncigdc/components/Aggregations/SuggestionFacet';
import FacetWrapper from '@ncigdc/components/FacetWrapper';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';

import { IBucket } from '@ncigdc/components/Aggregations/types';

import { withTheme } from '@ncigdc/theme';
import escapeForRelay from '@ncigdc/utils/escapeForRelay';
import NotMissingFacet from '@ncigdc/components/Aggregations/NotMissingFacet';
import UploadSetButton from '@ncigdc/components/UploadSetButton';
import { UploadSsmSet } from '@ncigdc/components/Modals/UploadSet';
import { ResultHighlights } from '@ncigdc/components/QuickSearch/QuickSearchResults';

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
    title: 'VEP Impact',
    field: 'consequence.transcript.annotation.vep_impact',
    full: 'ssms.consequence.transcript.annotation.vep_impact',
    doc_type: 'ssms',
    type: 'terms',
  },
  {
    title: 'SIFT Impact',
    field: 'consequence.transcript.annotation.sift_impact',
    full: 'ssms.consequence.transcript.annotation.sift_impact',
    doc_type: 'ssms',
    type: 'terms',
  },
  {
    title: 'Polyphen Impact',
    field: 'consequence.transcript.annotation.polyphen_impact',
    full: 'ssms.consequence.transcript.annotation.polyphen_impact',
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
    consequence__transcript__annotation__vep_impact: { buckets: [IBucket] },
    consequence__transcript__consequence_type: { buckets: [IBucket] },
    mutation_type: { buckets: [IBucket] },
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
      collapsed={props.idCollapsed}
      description="Enter Mutation UUID, DNA Change, Gene AA Change, COSMIC ID or dbSNP rs ID"
      field="ssms.ssm_id"
      setCollapsed={props.setIdCollapsed}
      title="Search Mutations"
      />
    <SuggestionFacet
      collapsed={props.idCollapsed}
      doctype="ssms"
      dropdownItem={(x, inputValue) => (
        <div>
          <div>
            <b>{x.ssm_id}</b>
          </div>
          <ResultHighlights item={x} query={inputValue} />
          <div>{x.genomic_dna_change}</div>
        </div>
      )}
      fieldNoDoctype="ssm_id"
      hits={props.suggestions}
      placeholder="e.g. BRAF V600E, chr7:g.140753336A>T"
      setAutocomplete={props.setAutocomplete}
      title="Mutation"
      />
    <UploadSetButton
      defaultQuery={{
        pathname: '/exploration',
        query: { searchTableTab: 'ssms' },
      }}
      displayType="mutation"
      idField="ssms.ssm_id"
      style={{
        width: '100%',
        padding: '0 1.2rem 1rem',
      }}
      type="ssm"
      UploadModal={UploadSsmSet}
      >
      Upload Mutation Set
    </UploadSetButton>
    <div
      style={{
        overflowY: 'scroll',
        maxHeight: `${props.maxFacetsPanelHeight - 68}px`, // 68 is the height of all elements above this div.
      }}
      >
      {presetFacets
        .filter(
          ({ full }) => ![
            'ssms.ssm_id',
            'ssms.cosmic_id',
            'ssms.consequence.transcript.annotation.dbsnp_rs',
          ].includes(full),
        )
        .map(facet => (
          <FacetWrapper
            additionalProps={facet.additionalProps}
            aggregation={props.aggregations[escapeForRelay(facet.field)]}
            countLabel="Mutations"
            facet={facet}
            greyHeader
            key={facet.full}
            relay={props.relay}
            title={facet.title}
            />
        ))}
      <FacetHeader
        collapsed={props.cosmicIdCollapsed}
        field="ssms.cosmic_id"
        greyHeader
        setCollapsed={props.setCosmicIdCollapsed}
        style={{ borderTop: `1px solid ${props.theme.greyScale5}` }}
        title="COSMIC ID"
        />
      {props.cosmicIdCollapsed || (
        <NotMissingFacet
          field="ssms.cosmic_id"
          notMissingDocCount={props.ssms.cosmic_id_not_missing.total}
          title="COSMIC ID"
          />
      )}
      <FacetHeader
        collapsed={props.dbSNPCollapsed}
        field="ssms.consequence.transcript.annotation.dbsnp_rs"
        greyHeader
        setCollapsed={props.setDbSNPCollapsed}
        style={{ borderTop: `1px solid ${props.theme.greyScale5}` }}
        title="dbSNP rs ID"
        />
      {props.dbSNPCollapsed || (
        <NotMissingFacet
          field="ssms.consequence.transcript.annotation.dbsnp_rs"
          notMissingDocCount={props.ssms.dbsnp_rs_not_missing.total}
          title="dbSNP rs ID"
          />
      )}
    </div>
  </div>
));

export const SSMAggregationsQuery = {
  fragments: {
    aggregations: () => Relay.QL`
      fragment RequiresStudy on SsmAggregations {
        consequence__transcript__annotation__vep_impact {
          buckets {
            doc_count
            key
          }
        }
        consequence__transcript__annotation__polyphen_impact {
          buckets {
            doc_count
            key
          }
        }
        consequence__transcript__annotation__sift_impact {
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
