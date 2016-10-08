/* @flow */

import React from 'react';
import Relay from 'react-relay';

import FileLink from '@ncigdc/components/Links/FileLink';
import FileSize from '@ncigdc/components/FileSize';

export type TProps = {
  node: {
    access: string,
    cases: {
      project: {
        project_id: string,
      },
    }[],
    data_category: string,
    data_format: string,
    file_id: string,
    file_name: string,
    file_size: number,
  },
};

export const FileTrComponent = ({ node }: TProps) => (
  <tr>
    <td>{node.access}</td>
    <td>
      <FileLink id={node.file_id}>
        {node.file_name}
      </FileLink>
    </td>
    <td>{node.cases.length}</td>
    <td>{new Set(node.cases.map(c => c.project.project_id))}</td>
    <td>{node.data_category}</td>
    <td>{node.data_format}</td>
    <td><FileSize bytes={node.file_size} /></td>
  </tr>
);

export const FileTrQuery = {
  fragments: {
    node: () => Relay.QL`
      fragment on File {
        file_id
        file_name
        file_size
        access
        data_category
        data_format
        cases {
          project {
            project_id
          }
        }
      }
    `,
  },
};

const FileTr = Relay.createContainer(
  FileTrComponent,
  FileTrQuery
);

export default FileTr;
