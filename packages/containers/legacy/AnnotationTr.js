/* @flow */

import React from 'react';
import Relay from 'react-relay';

import AnnotationLink from '@ncigdc/components/Links/AnnotationLink';

export type TProps = {
  node: {
    annotation_id: string,
    case_id: string,
    category: string,
    classification: string,
    created_datetime: string,
    entity_id: string,
    entity_type: string,
    project: {
      project_id: string,
    },
  },
};

export const AnnotationTrComponent = ({ node }: TProps) => (
  <tr>
    <td>
      <AnnotationLink id={node.annotation_id}>
        {node.annotation_id}
      </AnnotationLink>
    </td>
    <td>{node.case_id}</td>
    <td>{node.project.project_id}</td>
    <td>{node.entity_type}</td>
    <td>{node.entity_id}</td>
    <td>{node.category}</td>
    <td>{node.classification}</td>
    <td>{node.created_datetime}</td>
  </tr>
);

export const AnnotationTrQuery = {
  fragments: {
    node: () => Relay.QL`
      fragment on Annotation {
        annotation_id
        case_id
        project {
          project_id
        }
        entity_type
        entity_id
        category
        classification
        created_datetime
      }
    `,
  },
};

const AnnotationTr = Relay.createContainer(
  AnnotationTrComponent,
  AnnotationTrQuery
);

export default AnnotationTr;
