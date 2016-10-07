/* @flow */

import React from 'react';
import Relay from 'react-relay';

import FileTr from './FileTr';

export type TProps = {
  edges: [{
    node: {
      id: string,
    },
  }],
};

export const FileTBodyComponent = (props: TProps) => (
  <tbody>
    {props.edges.map(e => (
      <FileTr {...e} key={e.node.id} />
    ))}
  </tbody>
);

const FileTBodyQuery = {
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
};

const FileTBody = Relay.createContainer(
  FileTBodyComponent,
  FileTBodyQuery
);

export default FileTBody;
