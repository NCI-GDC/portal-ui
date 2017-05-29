/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';

import SearchPage from '@ncigdc/components/SearchPage';

import AnnotationTable from './AnnotationTable';
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
    facetTabs={[
      {
        id: 'cases',
        text: 'Cases',
        component: (
          <AnnotationAggregations
            aggregations={props.viewer.annotations.aggregations}
            suggestions={(props.viewer.autocomplete || { hits: [] }).hits}
            setAutocomplete={(value, onReadyStateChange) => props.relay.setVariables({ idAutocomplete: value, runAutocomplete: !!value }, onReadyStateChange)}
          />
        ),
      },
    ]}
    results={<AnnotationTable hits={props.viewer.annotations.hits} />}
  />
);

export const AnnotationsPageQuery = {
  initialVariables: {
    size: null,
    offset: null,
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
          aggregations(filters: $filters) {
            ${AnnotationAggregations.getFragment('aggregations')}
          }
          hits(first: $size offset: $offset, filters: $filters, sort: $annotations_sort) {
            ${AnnotationTable.getFragment('hits')}
          }
        }
      }
    `,
  },
};

const AnnotationsPage = Relay.createContainer(
  AnnotationsPageComponent,
  AnnotationsPageQuery
);

export default AnnotationsPage;
