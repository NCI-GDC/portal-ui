// @flow
import React from 'react';
import {
  RepositoryCasesLink,
  RepositoryFilesLink,
} from '@ncigdc/components/Links/RepositoryLink';
import ProjectLink from '@ncigdc/components/Links/ProjectLink';
import { Th, Td, ThNum, TdNum } from '@ncigdc/uikit/Table';
import { makeFilter } from '@ncigdc/utils/filters';
import formatFileSize from '@ncigdc/utils/formatFileSize';
import withRouter from '@ncigdc/utils/withRouter';
import { createDataCategoryColumns } from '@ncigdc/tableModels/utils';
import CollapsibleList from '@ncigdc/uikit/CollapsibleList';

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
  children === '0' ? (
    <span>0</span>
  ) : (
    <RepositoryCasesLink
      query={{
        filters: makeFilter([
          { field: 'cases.project.project_id', value: [node.project_id] },
          ...fields,
        ]),
      }}
    >
      {children}
    </RepositoryCasesLink>
  );

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
    td: ({ node }) => (
      <Td>
        <ProjectLink uuid={node.project_id}>{node.project_id}</ProjectLink>
      </Td>
    ),
  },
  {
    name: 'Disease Type',
    id: 'disease_type',
    sortable: true,
    downloadable: true,
    th: () => <Th rowSpan="2">Disease Type</Th>,
    td: ({ node }) => (
      <Td
        key={node.disease_type}
        style={{
          maxWidth: '200px',
          padding: '3px 15px 3px 3px',
          whiteSpace: 'normal',
        }}
      >
        {node.disease_type.length > 1 && (
          <CollapsibleList
            liStyle={{ whiteSpace: 'normal', listStyleType: 'disc' }}
            toggleStyle={{ fontStyle: 'normal' }}
            data={node.disease_type.slice(0).sort()}
            limit={0}
            expandText={`${node.disease_type.length} Disease Types`}
            collapseText="collapse"
          />
        )}
        {node.disease_type.length <= 1 && node.disease_type}
      </Td>
    ),
  },
  {
    name: 'Primary Site',
    id: 'primary_site',
    sortable: true,
    downloadable: true,
    th: () => <Th rowSpan="2">Primary Site</Th>,
    td: ({ node }) => (
      <Td
        key="primary_site"
        style={{
          maxWidth: '200px',
          padding: '3px 15px 3px 3px',
          whiteSpace: 'normal',
        }}
      >
        {node.primary_site.length > 1 && (
          <CollapsibleList
            liStyle={{ whiteSpace: 'normal', listStyleType: 'disc' }}
            toggleStyle={{ fontStyle: 'normal' }}
            data={node.primary_site.slice(0).sort()}
            limit={0}
            expandText={`${node.primary_site.length} Primary Sites`}
            collapseText="collapse"
          />
        )}
        {node.primary_site.length <= 1 && node.primary_site}
      </Td>
    ),
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
    th: () => <ThNum rowSpan="2">Cases</ThNum>,
    td: ({ node }) => (
      <TdNum>
        <CasesLink node={node}>
          {node.summary.case_count.toLocaleString()}
        </CasesLink>
      </TdNum>
    ),
    total: withRouter(({ hits, query }) => (
      <TdNum>
        <RepositoryCasesLink
          query={{
            filters: query.filters ? getProjectIdFilter(hits) : null,
          }}
        >
          {hits.edges
            .reduce((acc, val) => acc + val.node.summary.case_count, 0)
            .toLocaleString()}
        </RepositoryCasesLink>
      </TdNum>
    )),
  },
  ...dataCategoryColumns,
  {
    name: 'Files',
    id: 'summary.file_count',
    sortable: true,
    downloadable: true,
    th: () => <ThNum rowSpan="2">Files</ThNum>,
    td: ({ node }) => (
      <TdNum>
        <RepositoryFilesLink
          query={{
            filters: makeFilter([
              { field: 'cases.project.project_id', value: node.project_id },
            ]),
          }}
        >
          {node.summary.file_count.toLocaleString()}
        </RepositoryFilesLink>
      </TdNum>
    ),
    total: withRouter(({ hits, query }) => (
      <TdNum>
        <RepositoryFilesLink
          query={{
            filters: query.filters ? getProjectIdFilter(hits) : null,
          }}
        >
          {hits.edges
            .reduce((acc, val) => acc + val.node.summary.file_count, 0)
            .toLocaleString()}
        </RepositoryFilesLink>
      </TdNum>
    )),
  },
  {
    name: 'File size',
    id: 'summary.file_size',
    sortable: true,
    hidden: true,
    downloadable: true,
    th: () => <ThNum rowSpan="2">File Size</ThNum>,
    td: ({ node }) => <TdNum>{formatFileSize(node.summary.file_size)}</TdNum>,
    total: ({ hits }) => (
      <TdNum>
        {formatFileSize(
          hits.edges.reduce((acc, val) => acc + val.node.summary.file_size, 0),
        )}
      </TdNum>
    ),
  },
];

export default projectsTableModel;
