/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';

import Annotation from '@ncigdc/components/Annotation';

import FullWidthLayout from '@ncigdc/components/Layouts/FullWidthLayout';

export type TProps = {
  node: {
    annotation_id: string,
    case_id: string,
    category: string,
    classification: string,
    created_datetime: string,
    entity_id: string,
    entity_submitter_id: string,
    case_submitter_id: string,
    entity_type: string,
    notes: string,
    project: {
      project_id: string,
    },
    status: string,
  },
};

export const AnnotationPageComponent = ({ node }: TProps) =>
  <FullWidthLayout
    title={node.entity_id}
    entityType="AN"
    data-test="annotation-page"
  >
    <Annotation node={node} />
  </FullWidthLayout>;

export const AnnotationPageQuery = {
  fragments: {
    node: () => Relay.QL`
      fragment on Annotation {
        annotation_id
        entity_id
        entity_submitter_id
        case_submitter_id
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
  AnnotationPageQuery,
);

export default AnnotationPage;
