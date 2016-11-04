/* @flow */

import React from 'react';
import Relay from 'react-relay';

import TermAggregation from '@ncigdc/components/Aggregations/TermAggregation';

import type { TBucket } from '@ncigdc/components/Aggregations/types';

export type TProps = {
  aggregations: {
    disease_type: { buckets: [TBucket] },
    primary_site: { buckets: [TBucket] },
    program__name: { buckets: [TBucket] },
    project_id: { buckets: [TBucket] },
    summary__data_categories__data_category: { buckets: [TBucket] },
    summary__experimental_strategies__experimental_strategy: { buckets: [TBucket] },
  },
};

export const ProjectAggregationsComponent = (props: TProps) => {
  const docType = 'projects';
  const facets = [
    'disease_type',
    'primary_site',
    'program__name',
    'project_id',
    'summary__data_categories__data_category',
    'summary__experimental_strategies__experimental_strategy',
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


export const ProjectAggregationsQuery = {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on ProjectAggregations {
        primary_site {
          buckets {
            doc_count
            key
          }
        }
        program__name {
          buckets {
            doc_count
            key
          }
        }
        disease_type {
          buckets {
            doc_count
            key
          }
        }
        project_id {
          buckets {
            doc_count
            key
          }
        }
        summary__experimental_strategies__experimental_strategy {
          buckets {
            doc_count
            key
          }
        }
        summary__data_categories__data_category {
          buckets {
            doc_count
            key
          }
        }
      }
    `,
  },
};


const ProjectAggregations = Relay.createContainer(
  ProjectAggregationsComponent,
  ProjectAggregationsQuery
);

export default ProjectAggregations;
