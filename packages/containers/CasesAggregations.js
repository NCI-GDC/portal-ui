/* @flow */

import React from 'react';
import Relay from 'react-relay';
import { compose } from 'recompose';
import { createContainer } from 'recompose-relay';

import TermAggregation from '@ncigdc/components/Aggregations/TermAggregation';

import type { BucketType } from '@ncigdc/components/Aggregations/types';
import type { ViewerParamsType } from 'utils/uri/types';

type PropsType = {
  aggregations: {
    demographic__ethnicity: { buckets: [BucketType] },
    demographic__gender: { buckets: [BucketType] },
    demographic__race: { buckets: [BucketType] },
    diagnoses__vital_status: { buckets: [BucketType] },
    project__disease_type: { buckets: [BucketType] },
    project__primary_site: { buckets: [BucketType] },
    project__project_id: { buckets: [BucketType] },
  },
  relay: {
    route: {
      params: ViewerParamsType,
    },
  },
};

const CasesAggregations = (props: PropsType) => {
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
          pathname={'/files'}
          field={`${docType}.${f}`}
          params={props.relay.route.params}
          buckets={props.aggregations[f].buckets}
        />
      ))}
    </div>
  );
};

const CasesAggregationsQuery = {
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

export default compose(
  createContainer(CasesAggregationsQuery)
)(CasesAggregations);
