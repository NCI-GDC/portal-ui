import Relay from 'react-relay/classic';

// Added '-withCA' series separately for compatibility
// TODO: Consolidate once the study selection is implemented across all sections.

export const viewerQuery = {
  viewer: () => Relay.QL`query { viewer }`,
};

export const nodeQuery = {
  node: () => Relay.QL`query { node(id: $id) }`,
};

export const nodeAndViewerQuery = {
  node: () => Relay.QL`query { node(id: $id) }`,
  viewer: () => Relay.QL`query { viewer }`,
};

export const viewerQueryCA = {
  viewerWithCA: () => Relay.QL`query RequiresStudy { viewer }`,
};

export const nodeQueryCA = {
  nodeWithCA: () => Relay.QL`query RequiresStudy { viewer }`,
};

export const nodeAndViewerQueryCA = {
  nodeWithCA: () => Relay.QL`query RequiresStudy { viewer }`,
  viewerWithCA: () => Relay.QL`query RequiresStudy { viewer }`,
};
