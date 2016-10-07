/* @flow */

import React from 'react';
import Relay from 'react-relay';

import CaseTr from './CaseTr';

export type TProps = {
  hits: ?{
    edges: {
      node: {
        id: string,
      },
    }[],
    pageInfo: {
      endCursor: string,
      hasNextPage: boolean,
      hasPreviousPage: boolean,
      startCursor: string,
    },
  },
};

export const CaseTableComponent = (props: TProps) => (
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

export const CaseTableQuery = {
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
};

const CaseTable = Relay.createContainer(
  CaseTableComponent,
  CaseTableQuery
);

export default CaseTable;
