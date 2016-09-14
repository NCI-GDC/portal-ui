import Relay from 'react-relay';
import { tbody, h } from 'react-hyperscript-helpers';

import FileTr from 'containers/FileTr';

export const FileTBody = props => {
  console.log(2, props);
  return (
    tbody(
      props.edges.map(e => (
        h(FileTr, {
          ...e,
          key: e.node.id,
        })
      ))
    )
  );
};

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
