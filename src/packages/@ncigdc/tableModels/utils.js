// @flow
import React from "react";
import _ from "lodash";
import Tooltip from "@ncigdc/uikit/Tooltip/Tooltip";
import { tableToolTipHint } from "@ncigdc/theme/mixins";
import { DATA_CATEGORIES } from "@ncigdc/utils/constants";
import styled from "@ncigdc/theme/styled";
import { Th, Td } from "@ncigdc/uikit/Table";
import * as Links from "@ncigdc/components/Links/RepositoryLink";
import { makeFilter } from "@ncigdc/utils/filters";
import { findDataCategory } from "@ncigdc/utils/data";

const NumTh = styled(Th, { textAlign: "right" });
const NumTd = styled(Td, { textAlign: "right" });

export const createDataCategorySubColumns = (
  type,
  typeCount = type + "_count",
  Link = Links[`Repository${_.capitalize(type)}sLink`]
) => {
  let idFilter; // because of weird ternary bug https://github.com/babel/babel/issues/5809

  if (type === "case") {
    idFilter = node => ({
      field: "cases.project.project_id",
      value: node.project_id
    });
  } else {
    idFilter = node => ({
      field: "cases.case_id",
      value: node.case_id
    });
  }

  return _.map(DATA_CATEGORIES, (category, key) => ({
    name: category.abbr,
    id: category.abbr,
    subHeading: true,
    parent: "data_category",
    th: () => (
      <NumTh>
        <abbr>
          <Tooltip Component={category.full} style={tableToolTipHint()}>
            {category.abbr}
          </Tooltip>
        </abbr>
      </NumTh>
    ),
    td: ({ node }) => {
      const count = findDataCategory(
        category.abbr,
        node.summary.data_categories
      )[typeCount];
      return (
        <NumTd>
          {count === 0
            ? "0"
            : <Link
                query={{
                  filters: makeFilter(
                    [
                      idFilter(node),
                      { field: "files.data_category", value: category.full }
                    ],
                    false
                  )
                }}
              >
                {count.toLocaleString()}
              </Link>}
        </NumTd>
      );
    },
    total: ({ hits }) => (
      <NumTd>
        <Link
          query={{
            filters: makeFilter(
              [
                {
                  field: "cases.project.project_id",
                  value: hits.edges.map(({ node: p }) => p.project_id)
                },
                { field: "files.data_category", value: category.full }
              ],
              false
            )
          }}
        >
          {_.sumBy(
            hits.edges,
            x =>
              findDataCategory(category.abbr, x.node.summary.data_categories)[
                typeCount
              ]
          ).toLocaleString()}
        </Link>
      </NumTd>
    )
  }));
};
