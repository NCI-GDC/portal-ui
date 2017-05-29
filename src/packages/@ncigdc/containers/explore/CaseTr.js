/* @flow */

import React from "react";
import Relay from "react-relay/classic";
import { compose } from "recompose";
import { RepositoryFilesLink } from "@ncigdc/components/Links/RepositoryLink";
import CaseLink from "@ncigdc/components/Links/CaseLink";
import ExploreLink from "@ncigdc/components/Links/ExploreLink";
import ProjectLink from "@ncigdc/components/Links/ProjectLink";
import { DATA_CATEGORIES } from "@ncigdc/utils/constants";
import { findDataCategory, sumDataCategories } from "@ncigdc/utils/data";
import { makeFilter, addInFilters } from "@ncigdc/utils/filters";
import withFilters from "@ncigdc/utils/withFilters";
import MutationsCount from "@ncigdc/containers/MutationsCount";
import { ForTsvExport } from "@ncigdc/components/DownloadTableToTsvButton";

import type { TCategory } from "@ncigdc/utils/data/types";

import { Tr, Td, TdNum } from "@ncigdc/uikit/Table";

import { withTheme } from "@ncigdc/theme";

export type TProps = {|
  index: number,
  filters: Object,
  node: {|
    case_id: string,
    score: number,
    primary_site: string,
    submitter_id: string,
    demographic: {|
      gender: string
    |},
    project: {|
      project_id: string
    |},
    summary: {|
      data_categories: Array<{|
        case_count?: number,
        data_category: TCategory
      |}>
    |}
  |},
  theme: Object
|};

export const CaseTrComponent = compose(
  withFilters()
)(
  ({
    node,
    index,
    theme,
    explore: { mutationsCountFragment },
    filters
  }: TProps) => {
    const filesCount = sumDataCategories(node.summary.data_categories);

    type TFilesLinkProps = { fields?: Array<Object>, children?: mixed };
    type TFilesLink = (props: TFilesLinkProps) => any;
    const FilesLink: TFilesLink = ({ fields = [], children }) => (
      <RepositoryFilesLink
        query={{
          filters: makeFilter(
            [{ field: "cases.case_id", value: [node.case_id] }, ...fields],
            false
          )
        }}
      >
        {children}
      </RepositoryFilesLink>
    );

    return (
      <Tr
        style={{
          backgroundColor: index % 2 === 0 ? theme.tableStripe : "#fff"
        }}
      >
        <Td>
          <CaseLink uuid={node.case_id} merge whitelist={["filters"]}>
            {node.case_id.substr(0, 8)}
          </CaseLink>
          <ForTsvExport>
            {node.case_id}
          </ForTsvExport>
        </Td>
        <Td>{node.submitter_id}</Td>
        <Td>
          <ProjectLink uuid={node.project.project_id}>
            {node.project.project_id}
          </ProjectLink>
        </Td>
        <Td>{node.primary_site || "--"}</Td>
        <Td style={{ textTransform: "capitalize" }}>
          {node.demographic.gender || "--"}
        </Td>
        <Td style={{ textAlign: "right" }}>
          {filesCount > 0
            ? <FilesLink>{filesCount.toLocaleString()}</FilesLink>
            : 0}
        </Td>
        {Object.values(DATA_CATEGORIES).map((category: any) => {
          const count =
            findDataCategory(category.abbr, node.summary.data_categories)
              .file_count || 0;
          return (
            <TdNum key={category.abbr}>
              {count > 0
                ? <FilesLink
                    fields={[
                      { field: "files.data_category", value: category.full }
                    ]}
                  >
                    {count.toLocaleString()}
                  </FilesLink>
                : 0}
            </TdNum>
          );
        })}
        <Td style={{ textAlign: "right" }}>
          <MutationsCount
            key={node.case_id}
            ssms={mutationsCountFragment}
            filters={addInFilters(
              filters,
              makeFilter(
                [{ field: "cases.case_id", value: [node.case_id] }],
                false
              )
            )}
          />
        </Td>
        <Td style={{ textAlign: "right" }}>
          <ExploreLink
            merge
            query={{
              searchTableTab: "genes",
              filters: makeFilter(
                [{ field: "cases.case_id", value: [node.case_id] }],
                false
              )
            }}
          >
            {node.score.toLocaleString()}
          </ExploreLink>
        </Td>
      </Tr>
    );
  }
);

export const CaseTrQuery = {
  fragments: {
    node: () => Relay.QL`
      fragment on ECase {
        case_id
        primary_site
        submitter_id
        project {
          project_id
        }
        score
        demographic {
          gender
        }
        summary {
          data_categories {
            file_count
            data_category
          }
        }
      }
    `
  }
};

const CaseTr = Relay.createContainer(withTheme(CaseTrComponent), CaseTrQuery);

export default CaseTr;
