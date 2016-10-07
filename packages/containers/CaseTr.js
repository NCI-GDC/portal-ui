/* @flow */

import React from 'react';
import Relay from 'react-relay';

export type TProps = {
  kase: {
    case_id: string,
    demographic: {
      gender: string,
    },
    project: {
      primary_site: string,
      project_id: string,
    },
  },
};

export const CaseTrComponent = ({ kase }: TProps) => (
  <tr>
    <td>{kase.case_id}</td>
    <td>{kase.project.project_id}</td>
    <td>{kase.project.primary_site}</td>
    <td>{kase.demographic.gender}</td>
  </tr>
);

export const CaseTrQuery = {
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
};

const CaseTr = Relay.createContainer(
  CaseTrComponent,
  CaseTrQuery
);

export default CaseTr;
