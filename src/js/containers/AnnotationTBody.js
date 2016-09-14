import React from 'react';
import Relay from 'react-relay';

import AnnotationTr from 'containers/AnnotationTr';

export const AnnotationTBody = props => (
  <tbody>
    {props.edges.map(e => (
      <AnnotationTr {...e} key={e.node.id} />
    ))}
  </tbody>
);

export default Relay.createContainer(AnnotationTBody, {
  fragments: {
    edges: () => Relay.QL`
      fragment on AnnotationEdge @relay(plural: true){
        node {
          id
          ${AnnotationTr.getFragment('node')}
        }
      }
    `,
  },
});
