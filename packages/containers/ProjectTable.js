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
          <th rowSpan="2">ID</th>
          <th rowSpan="2">Disease Type</th>
          <th rowSpan="2">Primary Site</th>
          <th rowSpan="2">Program</th>
          <th rowSpan="2">Cases</th>
          <th colSpan="6">Available Cases per Data Category</th>
          <th rowSpan="2">Files</th>
        </tr>
        <tr>
          <th>Seq</th>
          <th>Exp</th>
          <th>SNV</th>
          <th>CNV</th>
          <th>Clinical</th>
          <th>Bio</th>
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
