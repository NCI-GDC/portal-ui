import React from 'react';
import Relay from 'react-relay';

import FileTr from 'containers/FileTr';

export const FileTBody = props => (
  <tbody>
    {props.edges.map(e => (
      <FileTr {...e} key={e.node.id} />
    ))}
  </tbody>
);

export default Relay.createContainer(FileTBody, {
  fragments: {
    edges: () => Relay.QL`
      fragment on FileEdge @relay(plural: true){
        node {
          id
          ${FileTr.getFragment('node')}
        }
      }
    `,
  },
});
