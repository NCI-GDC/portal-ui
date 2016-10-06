/* @flow */

import React from 'react';
import Relay from 'react-relay';
import { compose } from 'recompose';
import { createContainer } from 'recompose-relay';
import { Link } from 'react-router';

type TProps = {
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

const FileTr = ({ node }: TProps) => (
  <tr>
    <td>{node.access}</td>
    <td>
      <Link to={{ pathname: `/files/${node.file_id}` }}>
        {node.file_name}
      </Link>
    </td>
    <td>{node.cases.length}</td>
    <td>{new Set(node.cases.map(c => c.project.project_id))}</td>
    <td>{node.data_category}</td>
    <td>{node.data_format}</td>
    <td>{`${node.file_size}B`}</td>
  </tr>
);

const FileTrQuery = {
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

export default compose(
  createContainer(FileTrQuery)
)(FileTr);
