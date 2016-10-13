/* @flow */

import React from 'react';
import Relay from 'react-relay';

import Pagination from './Pagination';

import ProjectTr from './ProjectTr';

import type { TTableProps } from './types';

export const ProjectTableComponent = (props: TTableProps) => (
  <div>
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
      <tbody>
        {props.hits.edges.map(e => (
          <ProjectTr {...e} key={e.node.id} />
        ))}
      </tbody>
    </table>
    <Pagination pagination={props.hits.pagination} />
  </div>
);

export const ProjectTableQuery = {
  fragments: {
    hits: () => Relay.QL`
      fragment on ProjectConnection {
        pagination {
          sort
          ${Pagination.getFragment('pagination')}
        }
        edges @relay(plural: true) {
          node {
            id
            ${ProjectTr.getFragment('node')}
          }
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
