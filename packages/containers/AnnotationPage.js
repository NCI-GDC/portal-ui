/* @flow */

import React from 'react';
import Relay from 'react-relay';

type TProps = {
  node: {
    annotation_id: string,
    case_id: string,
    category: string,
    classification: string,
    created_datetime: string,
    entity_id: string,
    entity_submitter_id: string,
    entity_type: string,
    notes: string,
    project: {
      project_id: string,
    },
    status: string,
  },
};

export const AnnotationPageComponent = (props: TProps) => (
  <div>
    <div>{props.node.annotation_id}</div>
    <div>{props.node.entity_id}</div>
    <div>{props.node.entity_submitter_id}</div>
    <div>{props.node.entity_type}</div>
    <div>{props.node.case_id}</div>
    <div>{props.node.project.project_id}</div>
    <div>{props.node.classification}</div>
    <div>{props.node.category}</div>
    <div>{props.node.created_datetime}</div>
    <div>{props.node.status}</div>
    <div>{props.node.notes}</div>
  </div>
);

export const AnnotationPageQuery = {
  fragments: {
    node: () => Relay.QL`
      fragment on Annotation {
        annotation_id
        entity_id
        entity_submitter_id
        entity_type
        case_id
        project {
          project_id
        }
        classification
        category
        created_datetime
        status
        notes
      }
    `,
  },
};

const AnnotationPage = Relay.createContainer(
  AnnotationPageComponent,
  AnnotationPageQuery
);

export default AnnotationPage;
