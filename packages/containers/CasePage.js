/* @flow */

import React from 'react';
import Relay from 'react-relay';

export type TProps = {
  node: {
    case_id: string,
    project: {
      disease_type: string,
      name: string,
      primary_site: string,
      program: {
        name: string,
      },
      project_id: string,
    },
    submitter_id: string,
  },
};

export const CasePageComponent = (props: TProps) => (
  <div>
    <div>{props.node.case_id}</div>
    <div>{props.node.submitter_id}</div>
    <div>{props.node.project.project_id}</div>
    <div>{props.node.project.name}</div>
    <div>{props.node.project.disease_type}</div>
    <div>{props.node.project.program.name}</div>
    <div>{props.node.project.primary_site}</div>
  </div>
);

export const CasePageQuery = {
  fragments: {
    node: () => Relay.QL`
      fragment on Case {
        case_id
        submitter_id
        project {
          project_id
          name
          disease_type
          program {
            name
          }
          primary_site
        }
      }
    `,
  },
};

const CasePage = Relay.createContainer(
  CasePageComponent,
  CasePageQuery
);

export default CasePage;
