import Relay from 'react-relay';

export const viewerQuery = {
  viewer: () => Relay.QL`query { viewer }`,
};

export const nodeQuery = {
  node: () => Relay.QL`query { node(id: $id) }`,
};
