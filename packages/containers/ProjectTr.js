/* @flow */

import React from 'react';
import Relay from 'react-relay';

import ProjectLink from '@ncigdc/components/Links/ProjectLink';
import { findDataCategory } from '@ncigdc/utils/data';

import type { TCategory } from '@ncigdc/utils/data';

export type TProps = {|
  node: {|
    disease_type: string,
    name: string,
    primary_site: string,
    program: {|
      name: string,
    |},
    project_id: string,
    summary: {|
      case_count: number,
      data_categories: {|
        case_count: number,
        data_category: TCategory,
      |}[],
      file_count: number,
    |},
  |},
|};

export const ProjectTrComponent = ({ node }: TProps) => (
  <tr>
    <td>
      <ProjectLink id={node.project_id} />
    </td>
    <td>{node.disease_type}</td>
    <td>{node.primary_site}</td>
    <td>{node.program.name}</td>
    <td>{node.summary.case_count}</td>
    <td>{findDataCategory('Seq', node.summary.data_categories).case_count}</td>
    <td>{findDataCategory('Exp', node.summary.data_categories).case_count}</td>
    <td>{findDataCategory('SNV', node.summary.data_categories).case_count}</td>
    <td>{findDataCategory('CNV', node.summary.data_categories).case_count}</td>
    <td>{findDataCategory('Clinical', node.summary.data_categories).case_count}</td>
    <td>{findDataCategory('Bio', node.summary.data_categories).case_count}</td>
    <td>{node.summary.file_count}</td>
  </tr>
);

export const ProjectTrQuery = {
  fragments: {
    node: () => Relay.QL`
      fragment on Project {
        project_id
        disease_type
        program {
          name
        }
        primary_site
        summary {
          case_count
          data_categories {
            case_count
            data_category
          }
          file_count
        }
      }
    `,
  },
};

const ProjectTr = Relay.createContainer(
  ProjectTrComponent,
  ProjectTrQuery
);

export default ProjectTr;
