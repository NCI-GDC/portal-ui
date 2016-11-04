/* @flow */

import React from 'react';
import Relay from 'react-relay';

import Pagination from '../Pagination';

import FileTr from './FileTr';

import type { TTableProps } from '../types';

export const FileTableComponent = (props: TTableProps) => (
  <div>
    <table>
      <thead>
        <tr>
          <th>Access</th>
          <th>Name</th>
          <th>Cases</th>
          <th>Projects</th>
          <th>Category</th>
          <th>Format</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        {props.hits.edges.map(e => (
          <FileTr {...e} key={e.node.id} />
        ))}
      </tbody>
    </table>
    <Pagination pagination={props.hits.pagination} />
  </div>
);

export const FileTableQuery = {
  fragments: {
    hits: () => Relay.QL`
      fragment on FileConnection {
        pagination {
          sort
          ${Pagination.getFragment('pagination')}
        }
        edges {
          node {
            id
            ${FileTr.getFragment('node')}
          }
        }
      }
    `,
  },
};

const FileTable = Relay.createContainer(
  FileTableComponent,
  FileTableQuery
);

export default FileTable;
