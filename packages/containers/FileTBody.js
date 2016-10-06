/* @flow */

import React from 'react';
import Relay from 'react-relay';
import { compose } from 'recompose';
import { createContainer } from 'recompose-relay';

import FileTr from './FileTr';

type TProps = {
  edges: [{
    node: {
      id: string,
    },
  }],
};

const FileTBody = (props: TProps) => (
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

export default compose(
  createContainer(FileTBodyQuery)
)(FileTBody);
