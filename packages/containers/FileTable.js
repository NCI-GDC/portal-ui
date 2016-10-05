/* @flow */

import React from 'react';
import Relay from 'react-relay';
import { compose } from 'recompose';
import { createContainer } from 'recompose-relay';

import FileTBody from './FileTBody';
import Pagination from './Pagination';

type PropsType = {
  hits: {
    edges: [],
    pagination: {
      count: number,
      total: number,
    },
  },
};

const FileTable = (props: PropsType) => (
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

const FileTableQuery = {
  initialVariables: {
    first: 0,
    offset: 0,
    filters: null,
  },
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

export default compose(
  createContainer(FileTableQuery)
)(FileTable);
