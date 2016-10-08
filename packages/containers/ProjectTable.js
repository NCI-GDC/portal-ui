/* @flow */

import React from 'react';
import Relay from 'react-relay';

import ProjectTBody from './ProjectTBody';
import Pagination from './Pagination';

export type TProps = {
  hits: {
    edges: [],
    pagination: {
      count: number,
      total: number,
    },
  },
};

export const ProjectTableComponent = (props: TProps) => (
  <div>
    <h2>{`Projects ${props.hits.pagination.count} : ${props.hits.pagination.total}`}</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Disease Type</th>
          <th>Primary Site</th>
          <th>Program</th>
        </tr>
      </thead>
      <ProjectTBody edges={props.hits.edges} />
    </table>
    <Pagination pagination={props.hits.pagination} />
  </div>
);

export const ProjectTableQuery = {
  fragments: {
    hits: () => Relay.QL`
      fragment on ProjectConnection {
        pagination {
          count
          total
          ${Pagination.getFragment('pagination')}
        }
        edges {
          ${ProjectTBody.getFragment('edges')}
        }
      }
    `,
  },
};

const ProjectTable = Relay.createContainer(
  ProjectTableComponent,
  ProjectTableQuery
);

export default ProjectTable;
