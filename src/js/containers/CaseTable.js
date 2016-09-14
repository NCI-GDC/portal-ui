import React from 'react';
import Relay from 'react-relay';

import CaseTr from 'containers/CaseTr';

export const CaseTable = props => (
  <table>
    <thead>
      <tr>
        <th>Case UUID</th>
        <th>Project</th>
        <th>Primary Site</th>
        <th>Gender</th>
      </tr>
    </thead>
    <tbody>
      {
        ((props.hits || {}).edges || []).map(e => (
          <CaseTr key={e.node.id} kase={e.node} />
        ))
      }
    </tbody>
  </table>
);

export default Relay.createContainer(CaseTable, {
  fragments: {
    hits: () => Relay.QL`
      fragment on CaseConnection {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            id
            ${CaseTr.getFragment('kase')}
          }
        }
      }
    `,
  },
});
