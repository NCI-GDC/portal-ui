/* @flow */

import React from 'react';
import Relay from 'react-relay';

import ProjectLink from '@ncigdc/components/Links/ProjectLink';

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

export const ProjectTrComponent = ({ node }: TProps) => (
  <tr>
    <td>
      <ProjectLink id={node.project_id} />
    </td>
    <td>{node.disease_type}</td>
    <td>{node.primary_site}</td>
    <td>{node.program.name}</td>
  </tr>
);

export const ProjectTrQuery = {
  fragments: {
    node: () => Relay.QL`
      fragment on Project {
        project_id
        disease_type
        program {
          name
        }
        primary_site
      }
    `,
  },
};

const ProjectTr = Relay.createContainer(
  ProjectTrComponent,
  ProjectTrQuery
);

export default ProjectTr;
