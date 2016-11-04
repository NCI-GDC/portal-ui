/* @flow */

import React from 'react';
import Relay from 'react-relay';

import Pagination from './Pagination';

import CaseTr from './CaseTr';

import type { TTableProps } from './types';

export const CaseTableComponent = (props: TTableProps) => (
  <div>
    <table>
      <thead>
        <tr>
          <th rowSpan="2">Case UUID</th>
          <th rowSpan="2">Project</th>
          <th rowSpan="2">Primary Site</th>
          <th rowSpan="2">Gender</th>
          <th rowSpan="2">Files</th>
          <th colSpan="6">Available Cases per Data Category</th>
          <th rowSpan="2">Annotations</th>
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
          <CaseTr {...e} key={e.node.id} />
        ))}
      </tbody>
    </table>
    <Pagination pagination={props.hits.pagination} />
  </div>
);

export const CaseTableQuery = {
  fragments: {
    hits: () => Relay.QL`
      fragment on CaseConnection {
        pagination {
          sort
          ${Pagination.getFragment('pagination')}
        }
        edges {
          node {
            id
            ${CaseTr.getFragment('node')}
          }
        }
      }
    `,
  },
};

const CaseTable = Relay.createContainer(
  CaseTableComponent,
  CaseTableQuery
);

export default CaseTable;
