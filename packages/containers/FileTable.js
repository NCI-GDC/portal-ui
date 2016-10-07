/* @flow */

import React from 'react';
import Relay from 'react-relay';

import FileTBody from './FileTBody';
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

export const FileTableComponent = (props: TProps) => (
  <div>
    <h2>{`Files ${props.hits.pagination.count} : ${props.hits.pagination.total}`}</h2>
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
      <FileTBody edges={props.hits.edges} />
    </table>
    <Pagination pathname="/files" pagination={props.hits.pagination} />
  </div>
);

export const FileTableQuery = {
  fragments: {
    hits: () => Relay.QL`
      fragment on FileConnection {
        pagination {
          count
          total
          ${Pagination.getFragment('pagination')}
        }
        edges {
          ${FileTBody.getFragment('edges')}
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
