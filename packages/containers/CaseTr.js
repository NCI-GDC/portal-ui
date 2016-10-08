/* @flow */

import React from 'react';
import Relay from 'react-relay';

import CaseLink from '@ncigdc/components/Links/CaseLink';
import { findDataCategory } from '@ncigdc/utils/data';

import type { TCategory } from '@ncigdc/utils/data';

export type TProps = {|
  node: {|
    case_id: string,
    demographic: {|
      gender: string,
    |},
    project: {|
      primary_site: string,
      project_id: string,
    |},
    summary: {|
      data_categories: {|
        data_category: TCategory,
        file_count: number,
      |}[],
      file_count: number,
    |},
  |},
|};

export const CaseTrComponent = ({ node }: TProps) => (
  <tr>
    <td><CaseLink id={node.case_id} /></td>
    <td>{node.project.project_id}</td>
    <td>{node.project.primary_site}</td>
    <td>{node.demographic.gender}</td>
    <td>files</td>
    <td>{findDataCategory('Seq', node.summary.data_categories).file_count}</td>
    <td>{findDataCategory('Exp', node.summary.data_categories).file_count}</td>
    <td>{findDataCategory('SNV', node.summary.data_categories).file_count}</td>
    <td>{findDataCategory('CNV', node.summary.data_categories).file_count}</td>
    <td>{findDataCategory('Clinical', node.summary.data_categories).file_count}</td>
    <td>{findDataCategory('Bio', node.summary.data_categories).file_count}</td>
    <td>annotations</td>
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
        summary {
          file_count
          data_categories {
            file_count
            data_category
          }
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
