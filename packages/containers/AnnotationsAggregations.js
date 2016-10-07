/* @flow */

import React from 'react';
import Relay from 'react-relay';
import { compose } from 'recompose';
import { createContainer } from 'recompose-relay';

import TermAggregation from '@ncigdc/components/Aggregations/TermAggregation';

import type { TBucket } from '@ncigdc/components/Aggregations/types';

export type TProps = {
  aggregations: {
    category: { buckets: [TBucket] },
    classification: { buckets: [TBucket] },
    entity_type: { buckets: [TBucket] },
    project__primary_site: { buckets: [TBucket] },
    project__program__name: { buckets: [TBucket] },
    project__project_id: { buckets: [TBucket] },
    status: { buckets: [TBucket] },
  },
};

const AnnotationsAggregations = (props: TProps) => {
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
          field={`${docType}.${f}`}
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
