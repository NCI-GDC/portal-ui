/* @flow */

import React from 'react';
import Relay from 'react-relay';
import { compose } from 'recompose';
import { createContainer } from 'recompose-relay';

type TProps = {
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

const CaseTr = ({ kase }: TProps) => (
  <tr>
    <td>{kase.case_id}</td>
    <td>{kase.project.project_id}</td>
    <td>{kase.project.primary_site}</td>
    <td>{kase.demographic.gender}</td>
  </tr>
);

const CaseTrQuery = {
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

export default compose(
  createContainer(CaseTrQuery)
)(CaseTr);
