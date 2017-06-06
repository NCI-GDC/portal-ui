/* @flow */

import React from "react";
import Relay from "react-relay/classic";

import AnnotationLink from "@ncigdc/components/Links/AnnotationLink";
import CaseLink from "@ncigdc/components/Links/CaseLink";
import ProjectLink from "@ncigdc/components/Links/ProjectLink";

import { Tr, Td } from "@ncigdc/uikit/Table";

import { withTheme } from "@ncigdc/theme";
import { ForTsvExport } from "@ncigdc/components/DownloadTableToTsvButton";

export type TProps = {
  index: number,
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
  theme: Object,
};

export const AnnotationTrComponent = ({ node, index, theme }: TProps) => (
  <Tr
    style={{
      backgroundColor: index % 2 === 0 ? theme.tableStripe : "#fff",
    }}
  >
    <Td>
      <AnnotationLink uuid={node.annotation_id}>
        {node.annotation_id.substr(0, 8)}
      </AnnotationLink>
      <ForTsvExport>
        {node.annotation_id}
      </ForTsvExport>
    </Td>
    <Td>
      <CaseLink uuid={node.case_id}>
        {node.case_id.substr(0, 8)}
      </CaseLink>
      <ForTsvExport>
        {node.case_id}
      </ForTsvExport>
    </Td>
    <Td>
      <ProjectLink uuid={node.project.project_id}>
        {node.project.project_id}
      </ProjectLink>
    </Td>
    <Td>{node.entity_type}</Td>
    <Td>
      <CaseLink
        uuid={node.case_id}
        query={node.entity_type !== "case" ? { bioId: node.entity_id } : {}}
        deepLink={node.entity_type !== "case" ? "biospecimen" : undefined}
      >
        {node.entity_id.substr(0, 8)}
      </CaseLink>
      <ForTsvExport>
        {node.entity_id}
      </ForTsvExport>
    </Td>
    <Td>{node.category}</Td>
    <Td>{node.classification}</Td>
    <Td>{node.created_datetime}</Td>
  </Tr>
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
  withTheme(AnnotationTrComponent),
  AnnotationTrQuery,
);

export default AnnotationTr;
