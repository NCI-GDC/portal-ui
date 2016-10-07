/* @flow */

import React from 'react';
import Relay from 'react-relay';

import TermAggregation from '@ncigdc/components/Aggregations/TermAggregation';

import type { TBucket } from '@ncigdc/components/Aggregations/types';

export type TProps = {
  aggregations: {
    demographic__ethnicity: { buckets: [TBucket] },
    demographic__gender: { buckets: [TBucket] },
    demographic__race: { buckets: [TBucket] },
    diagnoses__vital_status: { buckets: [TBucket] },
    project__disease_type: { buckets: [TBucket] },
    project__primary_site: { buckets: [TBucket] },
    project__project_id: { buckets: [TBucket] },
  },
};

export const CasesAggregationsComponent = (props: TProps) => {
  const docType = 'cases';
  const facets = [
    'demographic__ethnicity',
    'demographic__gender',
    'demographic__race',
    'diagnoses__vital_status',
    'project__disease_type',
    'project__primary_site',
    'project__project_id',
  ];
  return (
    <div>
      {facets.map(f => (
        <TermAggregation
          key={`${docType}.${f}`}
          field={`${docType}.${f}`}
          buckets={props.aggregations[f].buckets}
        />
      ))}
    </div>
  );
};

export const CasesAggregationsQuery = {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on CasesAgg {
        demographic__ethnicity {
          buckets {
            doc_count
            key
          }
        }
        demographic__gender {
          buckets {
            doc_count
            key
          }
        }
        demographic__race {
          buckets {
            doc_count
            key
          }
        }
        diagnoses__vital_status {
          buckets {
            doc_count
            key
          }
        }
        project__disease_type {
          buckets {
            doc_count
            key
          }
        }
        project__primary_site {
          buckets {
            doc_count
            key
          }
        }
        project__project_id {
          buckets {
            doc_count
            key
          }
        }
      }
    `,
  },
};


const CasesAggregations = Relay.createContainer(
  CasesAggregationsComponent,
  CasesAggregationsQuery
);

export default CasesAggregations;
