/* @flow */

import React from 'react';
import Relay from 'react-relay';
import { compose } from 'recompose';
import { createContainer } from 'recompose-relay';

import AnnotationTable from './AnnotationTable';
import AnnotationsAggregations from './AnnotationsAggregations';

type PropsType = {
  viewer: {
    annotations: {
      aggregations: string,
      hits: string,
    },
  },
};

const AnnotationsPage = (props: PropsType) => (
  <div>
    <AnnotationsAggregations aggregations={props.viewer.annotations.aggregations} />
    <AnnotationTable hits={props.viewer.annotations.hits} />
  </div>
);

const AnnotationsPageQuery = {
  initialVariables: {
    first: 0,
    offset: 0,
    filters: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        annotations {
          aggregations(filters: $filters) {
            ${AnnotationsAggregations.getFragment('aggregations')}
          }
          hits(first: $first offset: $offset, filters: $filters) {
            ${AnnotationTable.getFragment('hits')}
          }
        }
      }
    `,
  },
};

export default compose(
  createContainer(AnnotationsPageQuery)
)(AnnotationsPage);
