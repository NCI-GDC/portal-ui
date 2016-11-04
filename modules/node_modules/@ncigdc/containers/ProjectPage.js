/* @flow */

import React from 'react';
import Relay from 'react-relay';

export type TProps = {
  node: {
    disease_type: string,
    name: string,
    primary_site: string,
    program: {
      name: string,
    },
    project_id: string,
  },
};

export const ProjectPageComponent = (props: TProps) => (
  <div>
    <div>{props.node.project_id}</div>
    <div>{props.node.name}</div>
    <div>{props.node.disease_type}</div>
    <div>{props.node.program.name}</div>
    <div>{props.node.primary_site}</div>
  </div>
);

export const ProjectPageQuery = {
  fragments: {
    node: () => Relay.QL`
      fragment on Project {
        project_id
        name
        disease_type
        program {
          name
        }
        primary_site
      }
    `,
  },
};

const ProjectPage = Relay.createContainer(
  ProjectPageComponent,
  ProjectPageQuery
);

export default ProjectPage;
