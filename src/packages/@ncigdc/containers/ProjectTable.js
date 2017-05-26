/* @flow */

import React from "react";
import { createFragmentContainer, graphql } from "react-relay/compat";
import { compose, mapProps } from "recompose";
import { sum } from "lodash";

import { Row } from "@ncigdc/uikit/Flex";
import TableActions from "@ncigdc/components/TableActions";
import Showing from "@ncigdc/components/Pagination/Showing";
import {
  RepositoryCasesLink,
  RepositoryFilesLink
} from "@ncigdc/components/Links/RepositoryLink";
import withRouter from "@ncigdc/utils/withRouter";
import { Tr, Th, Td, TdNum } from "@ncigdc/uikit/Table";
import { makeFilter } from "@ncigdc/utils/filters";
import { findDataCategory, CATEGORY_MAP } from "@ncigdc/utils/data";
import { DATA_CATEGORIES } from "@ncigdc/utils/constants";
import { tableToolTipHint } from "@ncigdc/theme/mixins";
import { Tooltip } from "@ncigdc/uikit/Tooltip";
import ProjectTr from "@ncigdc/containers/ProjectTr";
import { withTheme } from "@ncigdc/theme";
import type { TTableProps } from "./types";

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    borderSpacing: 0
  },
  right: {
    textAlign: "right"
  }
};

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

export const ProjectTableComponent = compose(
  withRouter,
  withTheme,
  mapProps(props => ({
    ...props,
    totalCases: sum(props.projects.edges.map(p => p.node.summary.case_count)),
    totalFiles: sum(props.projects.edges.map(p => p.node.summary.file_count))
  }))
)((props: TTableProps) => (
  <div>
    <Row
      style={{
        backgroundColor: "white",
        padding: "1rem",
        justifyContent: "space-between"
      }}
    >
      <Showing
        docType="projects"
        params={props.params}
        total={props.projects.total}
      />
      <TableActions
        prefix={"projects"}
        total={props.projects.total}
        sortKey="projects_sort"
        endpoint="projects"
        downloadFields={[
          "project_id",
          "primary_site",
          "disease_type",
          "program.name",
          "summary.case_count",
          "summary.file_count",
          "summary.file_size",
          "summary.data_categories.case_count",
          "summary.data_categories.file_count",
          "summary.data_categories.data_category"
        ]}
        sortOptions={[
          {
            id: "project_id",
            name: "Project ID"
          },
          {
            id: "primary_site",
            name: "Primary Site"
          },
          {
            id: "disease_type",
            name: "Disease Type"
          },
          {
            id: "program.name",
            name: "Program"
          },
          {
            id: "summary.case_count",
            name: "Cases"
          },
          {
            id: "summary.file_count",
            name: "Files"
          },
          {
            id: "summary.file_size",
            name: "File Size"
          }
        ]}
        tsvSelector="#projects-table"
        tsvFilename="projects-table.tsv"
      />
    </Row>
    <div style={{ overflowX: "auto" }}>
      <table style={styles.table} id="projects-table">
        <thead>
          <Tr>
            <Th rowSpan="2">Project ID</Th>
            <Th rowSpan="2">Disease Type</Th>
            <Th rowSpan="2">Primary Site</Th>
            <Th rowSpan="2">Program</Th>
            <Th rowSpan="2" style={styles.right}>Cases</Th>
            <Th
              colSpan={Object.entries(DATA_CATEGORIES).length}
              style={{ textAlign: "center" }}
            >
              Available Cases per Data Category
            </Th>
            <Th rowSpan="2" style={styles.right}>Files</Th>
          </Tr>
          <Tr>
            {Object.values(DATA_CATEGORIES).map(category => (
              <Th key={category.abbr} style={styles.right}>
                <abbr>
                  <Tooltip Component={category.full} style={tableToolTipHint()}>
                    {category.abbr}
                  </Tooltip>
                </abbr>
              </Th>
            ))}
          </Tr>
        </thead>
        <tbody>
          {props.projects.edges.map((e, i) => (
            <ProjectTr node={e.node} key={e.node.id} index={i} />
          ))}
          <Tr style={{ borderTop: `1px solid ${props.theme.greyScale4}` }}>
            <Td colSpan="4">
              <b>Total</b>
            </Td>
            <TdNum>
              {props.totalCases > 0
                ? <RepositoryCasesLink
                    query={{
                      filters: props.query.filters
                        ? getProjectIdFilter(props.projects)
                        : null
                    }}
                  >
                    {props.totalCases.toLocaleString()}
                  </RepositoryCasesLink>
                : 0}
            </TdNum>
            {Object.keys(CATEGORY_MAP)
              .filter(category => category !== "DNA")
              .map(category => {
                const count = sum(
                  props.projects.edges.map(
                    p =>
                      findDataCategory(category, p.node.summary.data_categories)
                        .case_count
                  )
                );

                return (
                  <TdNum key={category}>
                    {count > 0
                      ? <RepositoryCasesLink
                          query={{
                            filters: makeFilter(
                              [
                                {
                                  field: "cases.project.project_id",
                                  value: props.projects.edges.map(
                                    ({ node: p }) => p.project_id
                                  )
                                },
                                {
                                  field: "files.data_category",
                                  value: CATEGORY_MAP[category]
                                }
                              ],
                              false
                            )
                          }}
                        >
                          {count.toLocaleString()}
                        </RepositoryCasesLink>
                      : 0}
                  </TdNum>
                );
              })}
            <TdNum>
              {props.totalFiles > 0
                ? <RepositoryFilesLink
                    query={{
                      filters: props.query.filters
                        ? getProjectIdFilter(props.projects)
                        : null
                    }}
                  >
                    {props.totalFiles.toLocaleString()}
                  </RepositoryFilesLink>
                : 0}
            </TdNum>
          </Tr>
        </tbody>
      </table>
    </div>
  </div>
));

const ProjectTable = createFragmentContainer(
  ProjectTableComponent,
  graphql`
      fragment ProjectTable_projects on ProjectConnection {
        total
        edges @relay(plural: true) {
          node {
            id
            project_id
            disease_type
            program {
              name
            }
            primary_site
            summary {
              case_count
              data_categories {
                case_count
                data_category
              }
              file_count
            }
          }
        }
      }
    `
);

export default ProjectTable;
