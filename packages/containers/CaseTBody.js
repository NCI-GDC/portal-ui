/* @flow */

import React from 'react';
import Relay from 'react-relay';

import CaseTr from './CaseTr';

export type TProps = {
  edges: [{
    node: {
      id: string,
    },
  }],
};

export const CaseTBodyComponent = (props: TProps) => (
  <tbody>
    {props.edges.map(e => (
      <CaseTr {...e} key={e.node.id} />
    ))}
  </tbody>
);

const CaseTBodyQuery = {
  fragments: {
    edges: () => Relay.QL`
      fragment on CaseEdge @relay(plural: true){
        node {
          id
          ${CaseTr.getFragment('node')}
        }
      }
    `,
  },
};

const CaseTBody = Relay.createContainer(
  CaseTBodyComponent,
  CaseTBodyQuery
);

export default CaseTBody;
