/* @flow */

import Relay from 'react-relay/classic';

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
