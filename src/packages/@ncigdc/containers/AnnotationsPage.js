/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';

import SearchPage from '@ncigdc/components/SearchPage';

import AnnotationsTable from './AnnotationsTable';
import AnnotationAggregations from './AnnotationAggregations';

export type TProps = {
  location: Object,
  relay: Object,
  viewer: {
    autocomplete: {
      hits: Array<Object>,
    },
    annotations: {
      aggregations: string,
      hits: string,
    },
  },
};

export const AnnotationsPageComponent = (props: TProps) => (
  <SearchPage
    className="test-annotations-page"
    facetTabs={[
      {
        id: 'cases',
        text: 'Cases',
        component: (
          <AnnotationAggregations
            aggregations={props.viewer.annotations.aggregations}
            setAutocomplete={(value, onReadyStateChange) => props.relay.setVariables(
              {
                idAutocomplete: value,
                runAutocomplete: !!value,
              },
              onReadyStateChange,
            )}
            suggestions={(props.viewer.autocomplete || { hits: [] }).hits} />
        ),
      },
    ]}
    results={<AnnotationsTable hits={props.viewer.annotations.hits} />} />
);

export const AnnotationsPageQuery = {
  initialVariables: {
    annotations_size: null,
    annotations_offset: null,
    filters: null,
    idAutocomplete: null,
    runAutocomplete: false,
    annotations_sort: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        autocomplete: query(query: $idAutocomplete types: ["annotation"]) @include(if: $runAutocomplete) {
          hits {
            id
            ...on Annotation {
              annotation_id
            }
          }
        },
        annotations {
          aggregations(filters: $filters aggregations_filter_themselves: false) {
            ${AnnotationAggregations.getFragment('aggregations')}
          }
          hits(first: $annotations_size offset: $annotations_offset, filters: $filters, sort: $annotations_sort) {
            ${AnnotationsTable.getFragment('hits')}
          }
        }
      }
    `,
  },
};

const AnnotationsPage = Relay.createContainer(
  AnnotationsPageComponent,
  AnnotationsPageQuery,
);

export default AnnotationsPage;
