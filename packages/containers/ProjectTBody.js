/* @flow */

import React from 'react';
import Relay from 'react-relay';

import ProjectTr from './ProjectTr';

export type TProps = {
  edges: [{
    node: {
      id: string,
    },
  }],
};

export const ProjectTBodyComponent = (props: TProps) => (
  <tbody>
    {props.edges.map(e => (
      <ProjectTr {...e} key={e.node.id} />
    ))}
  </tbody>
);

const ProjectTBodyQuery = {
  fragments: {
    edges: () => Relay.QL`
      fragment on ProjectEdge @relay(plural: true){
        node {
          id
          ${ProjectTr.getFragment('node')}
        }
      }
    `,
  },
};

const ProjectTBody = Relay.createContainer(
  ProjectTBodyComponent,
  ProjectTBodyQuery
);

export default ProjectTBody;
