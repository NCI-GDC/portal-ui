import React from 'react';
import Relay from 'react-relay';

import FileTBody from 'containers/FileTBody';
import Pagination from 'containers/Pagination';

export const FileTable = props => (
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

export default Relay.createContainer(FileTable, {
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
});
