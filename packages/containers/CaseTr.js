/* @flow */

import React from 'react';
import Relay from 'react-relay';

import CaseLink from '@ncigdc/components/Links/CaseLink';

export type TProps = {
  node: {
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

export const CaseTrComponent = ({ node }: TProps) => (
  <tr>
    <td><CaseLink id={node.case_id} /></td>
    <td>{node.project.project_id}</td>
    <td>{node.project.primary_site}</td>
    <td>{node.demographic.gender}</td>
  </tr>
);

export const CaseTrQuery = {
  fragments: {
    node: () => Relay.QL`
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
