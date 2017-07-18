// @flow
import React from 'react';
import ProjectLink from '@ncigdc/components/Links/ProjectLink';
import CaseLink from '@ncigdc/components/Links/CaseLink';
import AnnotationLink from '@ncigdc/components/Links/AnnotationLink';
import { ForTsvExport } from '@ncigdc/components/DownloadTableToTsvButton';
import { Th, Td } from '@ncigdc/uikit/Table';

/*
- UUID: default (shorten UUID on the UI)
- Case UUID: hidden
- Case Submitter ID: default
- Program: hidden
- Project: default
- Entity Type: default
- Entity UUID: hidden
- Entity Submitter ID: default
- Category: default
- Classification: default
- Created Date: default
- Status: hidden
- Notes: hidden
*/

const annotationsTableModel = [
  {
    name: 'UUID',
    id: 'annotation_id',
    downloadable: true,
    th: () => <Th key="annotation_id" rowSpan="2">UUID</Th>,
    td: ({ node, index }) =>
      <Td>
        <AnnotationLink
          uuid={node.annotation_id}
          id={`row-${index}-annotation-link`}
          merge
          whitelist={['filters']}
        >
          {node.annotation_id.substr(0, 8)}
        </AnnotationLink>
        <ForTsvExport>
          {node.annotation_id}
        </ForTsvExport>
      </Td>,
  },
  {
    name: 'Case UUID',
    id: 'case_id',
    downloadable: true,
    hidden: true,
    th: () => <Th key="case_id" rowSpan="2">Case UUID</Th>,
    td: ({ node, index }) =>
      <Td>
        {node.case_id}
      </Td>,
  },
  {
    name: 'Case ID',
    id: 'case_submitter_id',
    downloadable: true,
    th: () => <Th key="case_submitter_id" rowSpan="2">Case ID</Th>,
    td: ({ node, index }) =>
      <Td>
        <CaseLink
          uuid={node.case_id}
          id={`row-${index}-case_submitter_id-link`}
          merge
          whitelist={['filters']}
        >
          {node.case_submitter_id}
        </CaseLink>
        <ForTsvExport>
          {node.case_id}
        </ForTsvExport>
      </Td>,
  },
  {
    name: 'Program',
    id: 'project.program.name',
    downloadable: true,
    hidden: true,
    th: () => <Th key="project.program.name" rowSpan="2">Program</Th>,
    td: ({ node, index }) =>
      <Td>
        <ProjectLink uuid={node.project.project_id}>
          {node.project.program.name}
        </ProjectLink>
        <ForTsvExport>
          {node.project.program.name}
        </ForTsvExport>
      </Td>,
  },
  {
    name: 'Project',
    id: 'project.project_id',
    downloadable: true,
    th: () => <Th key="project.project_id" rowSpan="2">Project</Th>,
    td: ({ node, index }) =>
      <Td>
        <ProjectLink uuid={node.project.project_id}>
          {node.project.project_id}
        </ProjectLink>
        <ForTsvExport>
          {node.project.project_id}
        </ForTsvExport>
      </Td>,
  },
  {
    name: 'Entity Type',
    id: 'entity_type',
    downloadable: true,
    th: () => <Th key="entity_type" rowSpan="2">Entity Type</Th>,
    td: ({ node, index }) =>
      <Td>
        {node.entity_type}
      </Td>,
  },
  {
    name: 'Entity UUID',
    id: 'entity_id',
    downloadable: true,
    hidden: true,
    th: () => <Th key="entity_id" rowSpan="2">Entity UUID</Th>,
    td: ({ node, index }) =>
      <Td>
        {node.entity_id}
      </Td>,
  },
  {
    name: 'Entity ID',
    id: 'entity_submitter_id',
    downloadable: true,
    th: () => <Th key="entity_submitter_id" rowSpan="2">Entity ID</Th>,
    td: ({ node, index }) =>
      <Td>
        <CaseLink
          uuid={node.case_id}
          query={node.entity_type !== 'case' ? { bioId: node.entity_id } : {}}
          deepLink={node.entity_type !== 'case' ? 'biospecimen' : undefined}
        >
          {node.entity_submitter_id}
        </CaseLink>
        <ForTsvExport>
          {node.entity_submitter_id}
        </ForTsvExport>
      </Td>,
  },
  {
    name: 'Category',
    id: 'category',
    downloadable: true,
    th: () => <Th key="category" rowSpan="2">Category</Th>,
    td: ({ node, index }) =>
      <Td>
        {node.category}
      </Td>,
  },
  {
    name: 'Classification',
    id: 'classification',
    downloadable: true,
    th: () => <Th key="classification" rowSpan="2">Classification</Th>,
    td: ({ node, index }) =>
      <Td>
        {node.classification}
      </Td>,
  },
  {
    name: 'Created Date',
    id: 'created_datetime',
    downloadable: true,
    th: () => <Th key="created_datetime" rowSpan="2">Created Date</Th>,
    td: ({ node, index }) =>
      <Td>
        {node.created_datetime}
      </Td>,
  },
  {
    name: 'Status',
    id: 'status',
    downloadable: true,
    hidden: true,
    th: () => <Th key="status" rowSpan="2">Status</Th>,
    td: ({ node, index }) =>
      <Td>
        {node.status}
      </Td>,
  },
  {
    name: 'Notes',
    id: 'notes',
    downloadable: true,
    hidden: true,
    th: () => <Th key="notes" rowSpan="2">Notes</Th>,
    td: ({ node, index }) =>
      <Td>
        {node.notes}
      </Td>,
  },
];

export default annotationsTableModel;
