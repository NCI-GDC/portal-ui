import React from 'react';
import Relay from 'react-relay';

const CaseTr = ({ kase }) => (
  <tr>
    <td>{kase.case_id}</td>
    <td>{kase.project.project_id}</td>
    <td>{kase.project.primary_site}</td>
    <td>{kase.demographic.gender}</td>
  </tr>
);

export default Relay.createContainer(CaseTr, {
  fragments: {
    kase: () => Relay.QL`
      fragment on Case {
        case_id
        project {
          project_id
          primary_site
        }
        demographic {
          gender
        }
      }
    `,
  },
});
