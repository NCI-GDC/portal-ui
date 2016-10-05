/* @flow */

import React from 'react';
import Relay from 'react-relay';
import { compose } from 'recompose';
import { createContainer } from 'recompose-relay';

import AnnotationTBody from './AnnotationTBody';
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

const AnnotationTable = (props: PropsType) => (
  <div>
    <h2>{`Annotations ${props.hits.pagination.count} : ${props.hits.pagination.total}`}</h2>
    <table>
      <thead>
        <tr>
          <th>UUID</th>
          <th>Case UUID</th>
          <th>Project</th>
          <th>Entity Type</th>
          <th>Entity UUID</th>
          <th>Category</th>
          <th>Classification</th>
          <th>Date Created</th>
        </tr>
      </thead>
      <AnnotationTBody edges={props.hits.edges} />
    </table>
    <Pagination pathname="/annotations" pagination={props.hits.pagination} />
  </div>
);

const AnnotationTableQuery = {
  initialVariables: {
    first: 0,
    offset: 0,
    filters: null,
  },
  fragments: {
    hits: () => Relay.QL`
      fragment on AnnotationConnection {
        pagination {
          count
          total
          ${Pagination.getFragment('pagination')}
        }
        edges {
          ${AnnotationTBody.getFragment('edges')}
        }
      }
    `,
  },
};

export default compose(
  createContainer(AnnotationTableQuery)
)(AnnotationTable);
