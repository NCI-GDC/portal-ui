/* @flow */

import React from 'react';
import Relay from 'react-relay';
import { compose } from 'recompose';
import { createContainer } from 'recompose-relay';

import TermAggregation from '@ncigdc/components/Aggregations/TermAggregation';

import type { BucketType } from '@ncigdc/components/Aggregations/types';
import type { ViewerParamsType } from 'utils/uri/types';

export type PropsType = {
  aggregations: {
    category: { buckets: [BucketType] },
    classification: { buckets: [BucketType] },
    entity_type: { buckets: [BucketType] },
    project__primary_site: { buckets: [BucketType] },
    project__program__name: { buckets: [BucketType] },
    project__project_id: { buckets: [BucketType] },
    status: { buckets: [BucketType] },
  },
  relay: {
    route: {
      params: ViewerParamsType,
    },
  },
};

const AnnotationsAggregations = (props: PropsType) => {
  const docType = 'annotations';
  const facets = [
    'classification',
    'category',
    'entity_type',
    'project__primary_site',
    'project__program__name',
    'project__project_id',
    'status',
  ];

  return (
    <div>
      {facets.map(f => (
        <TermAggregation
          key={`${docType}.${f}`}
          pathname={`/${docType}`}
          field={`${docType}.${f}`}
          params={props.relay.route.params}
          buckets={props.aggregations[f].buckets}
        />
      ))}
    </div>
  );
};


const AnnotationsAggregationsQuery = {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on AnnotationsAgg {
        category {
          buckets {
            doc_count
            key
          }
        }
        classification {
          buckets {
            doc_count
            key
          }
        }
        entity_type {
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
        project__program__name {
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
        status {
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
  createContainer(AnnotationsAggregationsQuery)
)(AnnotationsAggregations);
