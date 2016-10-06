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
    access: { buckets: [BucketType] },
    data_category: { buckets: [BucketType] },
    data_format: { buckets: [BucketType] },
    data_type: { buckets: [BucketType] },
    experimental_strategy: { buckets: [BucketType] },
    platform: { buckets: [BucketType] },
  },
  relay: {
    route: {
      params: ViewerParamsType,
    },
  },
};

const FilesAggregations = (props: PropsType) => {
  const docType = 'files';
  const facets = [
    'access',
    'data_category',
    'data_format',
    'data_type',
    'experimental_strategy',
    'platform',
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

const FilesAggregationsQuery = {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on FilesAgg {
        access {
          buckets {
            doc_count
            key
          }
        }
        data_category {
          buckets {
            doc_count
            key
          }
        }
        data_format {
          buckets {
            doc_count
            key
          }
        }
        data_type {
          buckets {
            doc_count
            key
          }
        }
        experimental_strategy {
          buckets {
            doc_count
            key
          }
        }
        platform {
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
  createContainer(FilesAggregationsQuery)
)(FilesAggregations);
