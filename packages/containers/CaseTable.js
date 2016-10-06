/* @flow */

import React from 'react';
import Relay from 'react-relay';
import { compose } from 'recompose';
import { createContainer } from 'recompose-relay';

import CaseTr from './CaseTr';

type TProps = {
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

const CaseTable = (props: TProps) => (
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

const CaseTableQuery = {
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

export default compose(
  createContainer(CaseTableQuery)
)(CaseTable);
