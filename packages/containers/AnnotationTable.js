/* @flow */

import React from 'react';
import Relay from 'react-relay';

import AnnotationTBody from './AnnotationTBody';
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

export const AnnotationTableComponent = (props: TProps) => (
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
    <Pagination pagination={props.hits.pagination} />
  </div>
);

export const AnnotationTableQuery = {
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

const AnnotationTable = Relay.createContainer(
  AnnotationTableComponent,
  AnnotationTableQuery
);

export default AnnotationTable;

