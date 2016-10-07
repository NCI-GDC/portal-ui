/* @flow */

import React from 'react';
import Relay from 'react-relay';

import AnnotationTr from './AnnotationTr';

export type TProps = {
  edges: [{
    node: {
      id: string,
    },
  }],
};

export const AnnotationTBodyComponent = (props: TProps) => (
  <tbody>
    {props.edges.map(e => (
      <AnnotationTr {...e} key={e.node.id} />
    ))}
  </tbody>
);

export const AnnotationTBodyQuery = {
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
};

const AnnotationTBody = Relay.createContainer(
  AnnotationTBodyComponent,
  AnnotationTBodyQuery
);

export default AnnotationTBody;

