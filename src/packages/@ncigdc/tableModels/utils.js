// @flow
import React from "react";
import _ from "lodash";
import Tooltip from "@ncigdc/uikit/Tooltip/Tooltip";
import { tableToolTipHint } from "@ncigdc/theme/mixins";
import { DATA_CATEGORIES } from "@ncigdc/utils/constants";
import styled from "@ncigdc/theme/styled";
import { Th, Td } from "@ncigdc/uikit/Table";
import { makeFilter } from "@ncigdc/utils/filters";
import { findDataCategory } from "@ncigdc/utils/data";

const NumTh = styled(Th, { textAlign: "right" });
const NumTd = styled(Td, { textAlign: "right" });

export const createDataCategoryColumns = ({
  title,
  countKey,
  Link,
  getCellLinkFilters,
  getTotalLinkFilters
}) => {
  return [
    {
      name: "Data Categories",
      id: "data_category",
      th: () => (
        <Th
          key="data_category"
          colSpan={Object.keys(DATA_CATEGORIES).length}
          style={{ textAlign: "center" }}
        >
          {title}
        </Th>
      ),
      subHeadingIds: _.map(DATA_CATEGORIES, category => category.id)
    },
    ..._.map(DATA_CATEGORIES, (category, key) => ({
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
        )[countKey];
        return (
          <NumTd>
            {count === 0
              ? "0"
              : <Link
                  query={{
                    filters: makeFilter([
                      ...getCellLinkFilters(node),
                      { field: "files.data_category", value: category.full }
                    ])
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
              filters: makeFilter([
                ...getTotalLinkFilters(hits),
                { field: "files.data_category", value: category.full }
              ])
            }}
          >
            {_.sumBy(
              hits.edges,
              x =>
                findDataCategory(category.abbr, x.node.summary.data_categories)[
                  countKey
                ]
            ).toLocaleString()}
          </Link>
        </NumTd>
      )
    }))
  ];
};
