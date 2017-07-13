// @flow
import React from 'react';
import {
  RepositoryCasesLink,
  RepositoryFilesLink,
} from '@ncigdc/components/Links/RepositoryLink';
import ProjectLink from '@ncigdc/components/Links/ProjectLink';
import { Th, Td } from '@ncigdc/uikit/Table';
import { makeFilter } from '@ncigdc/utils/filters';
import formatFileSize from '@ncigdc/utils/formatFileSize';
import withRouter from '@ncigdc/utils/withRouter';
import styled from '@ncigdc/theme/styled';
import { createDataCategoryColumns } from './utils';

const NumTh = styled(Th, { textAlign: 'right' });
const NumTd = styled(Td, { textAlign: 'right' });

type TLinkProps = { node: Object, fields?: Array<Object>, children?: mixed };
type TLink = (props: TLinkProps) => any;

const dataCategoryColumns = createDataCategoryColumns({
  title: 'Available Cases per Data Category',
  countKey: 'case_count',
  Link: RepositoryCasesLink,
  getCellLinkFilters: node => [
    {
      field: 'cases.project.project_id',
      value: node.project_id,
    },
  ],
  getTotalLinkFilters: hits => [
    {
      field: 'cases.project.project_id',
      value: hits.edges.map(({ node: p }) => p.project_id),
    },
  ],
});

const CasesLink: TLink = ({ node, fields = [], children }) =>
  children === '0'
    ? <span>0</span>
    : <RepositoryCasesLink
        query={{
          filters: makeFilter([
            { field: 'cases.project.project_id', value: [node.project_id] },
            ...fields,
          ]),
        }}
      >
        {children}
      </RepositoryCasesLink>;

const getProjectIdFilter = projects =>
  makeFilter([
    {
      field: 'cases.project.project_id',
      value: projects.edges.map(({ node: p }) => p.project_id),
    },
  ]);

const projectsTableModel = [
  {
    name: 'Project',
    id: 'project_id',
    sortable: true,
    downloadable: true,
    th: () => <Th rowSpan="2">Project</Th>,
    td: ({ node }) =>
      <Td>
        <ProjectLink uuid={node.project_id}>
          {node.project_id}
        </ProjectLink>
      </Td>,
  },
  {
    name: 'Disease Type',
    id: 'disease_type',
    sortable: true,
    downloadable: true,
    th: () => <Th rowSpan="2">Disease Type</Th>,
    td: ({ node }) =>
      <Td key={node.disease_type} style={{ whiteSpace: 'normal' }}>
        {node.disease_type}
      </Td>,
  },
  {
    name: 'Primary Site',
    id: 'primary_site',
    sortable: true,
    downloadable: true,
    th: () => <Th rowSpan="2">Primary Site</Th>,
    td: ({ node }) => <Td key="primary_site">{node.primary_site}</Td>,
  },
  {
    name: 'Program',
    id: 'program.name',
    sortable: true,
    downloadable: true,
    th: () => <Th rowSpan="2">Program</Th>,
    td: ({ node }) => <Td key="program">{node.program.name}</Td>,
  },
  {
    name: 'Cases',
    id: 'summary.case_count',
    sortable: true,
    downloadable: true,
    th: () => <NumTh rowSpan="2">Cases</NumTh>,
    td: ({ node }) =>
      <NumTd>
        <CasesLink node={node}>
          {node.summary.case_count.toLocaleString()}
        </CasesLink>
      </NumTd>,
    total: withRouter(({ hits, query }) =>
      <NumTd>
        <RepositoryCasesLink
          query={{
            filters: query.filters ? getProjectIdFilter(hits) : null,
          }}
        >
          {hits.edges
            .reduce((acc, val) => acc + val.node.summary.case_count, 0)
            .toLocaleString()}
        </RepositoryCasesLink>
      </NumTd>,
    ),
  },
  ...dataCategoryColumns,
  {
    name: 'Files',
    id: 'summary.file_count',
    sortable: true,
    downloadable: true,
    th: () => <NumTh rowSpan="2">Files</NumTh>,
    td: ({ node }) =>
      <NumTd>
        <RepositoryFilesLink
          query={{
            filters: makeFilter([
              { field: 'cases.project.project_id', value: node.project_id },
            ]),
          }}
        >
          {node.summary.file_count.toLocaleString()}
        </RepositoryFilesLink>
      </NumTd>,
    total: withRouter(({ hits, query }) =>
      <NumTd>
        <RepositoryFilesLink
          query={{
            filters: query.filters ? getProjectIdFilter(hits) : null,
          }}
        >
          {hits.edges
            .reduce((acc, val) => acc + val.node.summary.file_count, 0)
            .toLocaleString()}
        </RepositoryFilesLink>
      </NumTd>,
    ),
  },
  {
    name: 'File size',
    id: 'summary.file_size',
    sortable: true,
    hidden: true,
    downloadable: true,
    th: () => <NumTh rowSpan="2">File Size</NumTh>,
    td: ({ node }) =>
      <NumTd>
        {formatFileSize(node.summary.file_size)}
      </NumTd>,
    total: ({ hits }) =>
      <NumTd>
        {formatFileSize(
          hits.edges.reduce((acc, val) => acc + val.node.summary.file_size, 0),
        )}
      </NumTd>,
  },
];

export default projectsTableModel;
