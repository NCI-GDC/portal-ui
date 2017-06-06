/* @flow */

import React from "react";
import Relay from "react-relay/classic";
import withFilters from "@ncigdc/utils/withFilters";
import { makeFilter, addInFilters } from "@ncigdc/utils/filters";

import { Row } from "@ncigdc/uikit/Flex";
import Showing from "@ncigdc/components/Pagination/Showing";

import Pagination from "@ncigdc/components/Pagination";

import TableActions from "@ncigdc/components/TableActions";

import { Tr, Th } from "@ncigdc/uikit/Table";
import { Tooltip } from "@ncigdc/uikit/Tooltip";
import { DATA_CATEGORIES } from "@ncigdc/utils/constants";
import { tableToolTipHint } from "@ncigdc/theme/mixins";

import { compose, withPropsOnChange, withState } from "recompose";
import CaseTr from "./CaseTr";

import type { TTableProps } from "../types";

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    borderSpacing: 0,
  },
  right: {
    textAlign: "right",
  },
};

export const CaseTableComponent = compose(
  withFilters(),
  withState("ssmCountsLoading", "setSsmCountsLoading", true),
  withPropsOnChange(
    ["hits"],
    ({
      setSsmCountsLoading,
      ssmCountsLoading,
      hits,
      relay,
      filters
    }: TTableProps) => {
      const caseIds = hits.edges.map(e => e.node.case_id);
      if (!ssmCountsLoading) {
        setSsmCountsLoading(true);
      }
      relay.setVariables(
        {
          fetchSsmCounts: !!caseIds.length,
          ssmCountsfilters: caseIds.length
            ? addInFilters(
                filters,
                makeFilter(
                  [
                    {
                      field: "occurrence.case.case_id",
                      value: caseIds
                    }
                  ],
                  false
                )
              )
            : null
        },
        readyState => {
          if (readyState.done) {
            setSsmCountsLoading(false);
          }
        }
      );
    }
  ),
  withPropsOnChange(["explore"], ({ explore }: TTableProps) => {
    const { occurrence__case__case_id: { buckets } } = explore.ssms
      .aggregations || {
      occurrence__case__case_id: { buckets: [] }
    };
    const ssmCounts = buckets.reduce(
      (acc, b) => ({ ...acc, [b.key]: b.doc_count }),
      {}
    );
    return { ssmCounts };
  })
)((props: TTableProps) => {
  const prefix = "cases";
  const { ssmCounts, ssmCountsLoading } = props;
  return (
    <div>
      <Row
        style={{
          backgroundColor: "white",
          padding: "1rem",
          justifyContent: "space-between",
        }}
      >
        <Showing
          docType="cases"
          prefix={prefix}
          params={props.relay.route.params}
          total={props.hits.total}
        />
        <TableActions
          prefix={prefix}
          total={props.hits.total}
          sortKey="cases_sort"
          endpoint={props.endpoint || "cases"}
          downloadTooltip="Export All Except #Mutations and #Genes"
          downloadFields={[
            "case_id",
            "project.project_id",
            "cases.primary_site",
            "demographic.gender",
            "summary.data_categories.file_count",
            "summary.data_categories.data_category",
          ]}
          sortOptions={[
            {
              id: "project.project_id",
              name: "Project",
            },
            {
              id: "primary_site",
              name: "Primary Site",
            },
            {
              id: "demographic.gender",
              name: "Gender",
            },
          ]}
          tsvSelector="#explore-case-table"
          tsvFilename="explore-case-table.tsv"
        />
      </Row>
      <div style={{ overflowX: "auto" }}>
        <table style={styles.table} id="explore-case-table">
          <thead>
            <Tr>
              <Th rowSpan="2">Case UUID</Th>
              <Th rowSpan="2">Submitter ID</Th>
              <Th rowSpan="2">Project</Th>
              <Th rowSpan="2">Primary Site</Th>
              <Th rowSpan="2">Gender</Th>
              <Th rowSpan="2" style={styles.right}>Files</Th>
              <Th
                colSpan={Object.entries(DATA_CATEGORIES).length}
                style={styles.center}
              >
                Available Files per Data Category
              </Th>
              <Th rowSpan="2" style={styles.right}>
                <Tooltip
                  Component="# Simple Somatic Mutations Filtered by current criteria"
                  style={tableToolTipHint()}
                >
                  # Mutations
                </Tooltip>
              </Th>
              <Th rowSpan="2" style={styles.right}>
                <Tooltip
                  Component="# Genes with Simple Somatic Mutations Filtered by current criteria"
                  style={tableToolTipHint()}
                >
                  # Genes
                </Tooltip>
              </Th>
            </Tr>

            <Tr>
              {Object.values(DATA_CATEGORIES).map((category: any) => (
                <Th key={category.abbr} style={styles.right}>
                  <abbr>
                    <Tooltip
                      Component={category.full}
                      style={tableToolTipHint()}
                    >
                      {category.abbr}
                    </Tooltip>
                  </abbr>
                </Th>
              ))}
            </Tr>
          </thead>
          <tbody>
            {props.hits.edges.map((e, i) => (
              <CaseTr
                {...e}
                key={e.node.id}
                ssmCount={ssmCounts[e.node.case_id]}
                ssmCountsLoading={ssmCountsLoading}
                index={i}
                explore={props.explore}
              />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        prefix={prefix}
        params={props.relay.route.params}
        total={props.hits.total}
      />
    </div>
  );
});

export const CaseTableQuery = {
  initialVariables: {
    fetchSsmCounts: false,
    ssmCountsfilters: null
  },
  fragments: {
    hits: () => Relay.QL`
      fragment on ECaseConnection {
        total
        edges {
          node {
            id
            case_id
            ${CaseTr.getFragment("node")}
          }
        }
      }
    `,
  },
};

const CaseTable = Relay.createContainer(CaseTableComponent, CaseTableQuery);

export default CaseTable;
