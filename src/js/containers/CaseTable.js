import Relay from 'react-relay';
import { table, thead, tbody, tr, th, h } from 'react-hyperscript-helpers';

import CaseTr from 'containers/CaseTr';

export const CaseTable = props => (
  table([
    thead([
      tr([
        th('Case UUID'),
        th('Project'),
        th('Primary Site'),
        th('Gender'),
      ]),
    ]),
    tbody(
      ((props.hits || {}).edges || []).map(e => (
        h(CaseTr, {
          key: e.node.id,
          kase: e.node,
        })
      ))
    ),
  ]),
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
