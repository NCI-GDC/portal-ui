import Relay from 'react-relay';
import { div, h } from 'react-hyperscript-helpers';

import AnnotationTable from 'containers/AnnotationTable';
import AnnotationsAggregations from 'containers/AnnotationsAggregations';

export const AnnotationsPage = props => {
  console.log('AnnotationsPage', props);
  return div([
    h(AnnotationsAggregations, { aggregations: props.viewer.annotations.aggregations }),
    h(AnnotationTable, { hits: props.viewer.annotations.hits }),
  ]);
};

export default Relay.createContainer(AnnotationsPage, {
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
});
