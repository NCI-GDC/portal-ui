// @flow
import React from "react";
import {
  RepositoryCasesLink,
  RepositoryFilesLink
} from "@ncigdc/components/Links/RepositoryLink";
import ProjectLink from "@ncigdc/components/Links/ProjectLink";
import { Th, Td } from "@ncigdc/uikit/Table";
import { makeFilter } from "@ncigdc/utils/filters";
import formatFileSize from "@ncigdc/utils/formatFileSize";
import withRouter from "@ncigdc/utils/withRouter";
import styled from "@ncigdc/theme/styled";
import { createDataCategorySubColumns } from "./utils";

const NumTh = styled(Th, { textAlign: "right" });
const NumTd = styled(Td, { textAlign: "right" });

type TLinkProps = { node: Object, fields?: Array<Object>, children?: mixed };
type TLink = (props: TLinkProps) => any;

const dataCategorySubColumns = createDataCategorySubColumns("case");

const CasesLink: TLink = ({ node, fields = [], children }) =>
  children === "0"
    ? <span>0</span>
    : <RepositoryCasesLink
        query={{
          filters: makeFilter(
            [
              { field: "cases.project.project_id", value: [node.project_id] },
              ...fields
            ],
            false
          )
        }}
      >
        {children}
      </RepositoryCasesLink>;

const getProjectIdFilter = projects =>
  makeFilter(
    [
      {
        field: "cases.project.project_id",
        value: projects.edges.map(({ node: p }) => p.project_id)
      }
    ],
    false
  );

const projectsTableModel = [
  {
    name: "Project ID",
    id: "project_id",
    sortable: true,
    downloadable: true,
    th: () => <Th rowSpan="2">Project ID</Th>,
    td: ({ node }) => (
      <Td>
        <ProjectLink uuid={node.project_id}>
          {node.project_id}
        </ProjectLink>
      </Td>
    )
  },
  {
    name: "Disease Type",
    id: "disease_type",
    sortable: true,
    downloadable: true,
    th: () => <Th rowSpan="2">Disease Type</Th>,
    td: ({ node }) => (
      <Td key={node.disease_type} style={{ whiteSpace: "normal" }}>
        {node.disease_type}
      </Td>
    )
  },
  {
    name: "Primary Site",
    id: "primary_site",
    sortable: true,
    downloadable: true,
    th: () => <Th rowSpan="2">Primary Site</Th>,
    td: ({ node }) => <Td key="primary_site">{node.primary_site}</Td>
  },
  {
    name: "Program",
    id: "program.name",
    sortable: true,
    downloadable: true,
    th: () => <Th rowSpan="2">Program</Th>,
    td: ({ node }) => <Td key="program">{node.program.name}</Td>
  },
  {
    name: "Cases",
    id: "summary.case_count",
    sortable: true,
    downloadable: true,
    th: () => <NumTh rowSpan="2">Cases</NumTh>,
    td: ({ node }) => (
      <NumTd>
        <CasesLink node={node}>
          {node.summary.case_count.toLocaleString()}
        </CasesLink>
      </NumTd>
    ),
    total: withRouter(({ hits, query }) => (
      <NumTd>
        <RepositoryCasesLink
          query={{
            filters: query.filters ? getProjectIdFilter(hits) : null
          }}
        >
          {hits.edges
            .reduce((acc, val) => acc + val.node.summary.case_count, 0)
            .toLocaleString()}
        </RepositoryCasesLink>
      </NumTd>
    ))
  },
  ...[
    {
      name: "Data Categories",
      id: "data_category",
      th: () => (
        <Th
          key="data_category"
          colSpan={dataCategorySubColumns.length}
          style={{ textAlign: "center" }}
        >
          Available Cases per Data Category
        </Th>
      ),
      subHeadingIds: dataCategorySubColumns.map(x => x.id)
    },
    ...dataCategorySubColumns
  ],
  {
    name: "Files",
    id: "summary.file_count",
    sortable: true,
    downloadable: true,
    th: () => <NumTh rowSpan="2">Files</NumTh>,
    td: ({ node }) => (
      <NumTd>
        <RepositoryFilesLink
          query={{
            filters: makeFilter(
              [{ field: "cases.project.project_id", value: node.project_id }],
              false
            )
          }}
        >
          {node.summary.file_count.toLocaleString()}
        </RepositoryFilesLink>
      </NumTd>
    ),
    total: withRouter(({ hits, query }) => (
      <NumTd>
        <RepositoryFilesLink
          query={{
            filters: query.filters ? getProjectIdFilter(hits) : null
          }}
        >
          {hits.edges
            .reduce((acc, val) => acc + val.node.summary.file_count, 0)
            .toLocaleString()}
        </RepositoryFilesLink>
      </NumTd>
    ))
  },
  {
    name: "File size",
    id: "summary.file_size",
    sortable: true,
    hidden: true,
    downloadable: true,
    th: () => <NumTh rowSpan="2">File Size</NumTh>,
    td: ({ node }) => (
      <NumTd>
        {formatFileSize(node.summary.file_size)}
      </NumTd>
    ),
    total: ({ hits }) => (
      <NumTd>
        {formatFileSize(
          hits.edges.reduce((acc, val) => acc + val.node.summary.file_size, 0)
        )}
      </NumTd>
    )
  }
];

export default projectsTableModel;
