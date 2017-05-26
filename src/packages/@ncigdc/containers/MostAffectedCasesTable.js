// @flow

import React from "react";
import Relay from "react-relay/classic";
import withSize from "@ncigdc/utils/withSize";
import { isEqual } from "lodash";
import { withPropsOnChange, compose } from "recompose";

import { parseIntParam, parseFilterParam } from "@ncigdc/utils/uri";
import Showing from "@ncigdc/components/Pagination/Showing";
import { withTheme } from "@ncigdc/theme";
import ageDisplay from "@ncigdc/utils/ageDisplay";
import { DATA_CATEGORIES } from "@ncigdc/utils/constants";
import { tableToolTipHint } from "@ncigdc/theme/mixins";
import CaseLink from "@ncigdc/components/Links/CaseLink";
import ExploreLink from "@ncigdc/components/Links/ExploreLink";
import withRouter from "@ncigdc/utils/withRouter";
import Loader from "@ncigdc/uikit/Loaders/Loader";
import { RepositoryFilesLink } from "@ncigdc/components/Links/RepositoryLink";
import { makeFilter } from "@ncigdc/utils/filters";
import EntityPageHorizontalTable
  from "@ncigdc/components/EntityPageHorizontalTable";
import { Row } from "@ncigdc/uikit/Flex";
import { Tooltip } from "@ncigdc/uikit/Tooltip";
import Pagination from "@ncigdc/components/Pagination";
import MutationsCount from "@ncigdc/containers/MutationsCount";
import { ForTsvExport } from "@ncigdc/components/DownloadTableToTsvButton";
import TableActions from "@ncigdc/components/TableActions";

const MostAffectedCasesTableComponent = compose(
  withRouter,
  withPropsOnChange(
    (props, nextProps) =>
      ["query", "defaultFilters"].some(
        propName => !isEqual(props[propName], nextProps[propName])
      ),
    ({ relay, query, defaultFilters }) => {
      relay.setVariables({
        fetchData: true,
        macTable_offset: parseIntParam(query.macTable_offset, 0),
        macTable_size: parseIntParam(query.macTable_size, 10),
        macTable_filters: parseFilterParam(
          query.macTable_filters,
          defaultFilters || null
        )
      });
    }
  ),
  withTheme,
  withSize()
)(
  (
    { explore: { cases, mutationsCountFragment }, relay, defaultFilters } = {}
  ) => {
    if (cases && !cases.hits.edges.length) {
      return <Row style={{ padding: "1rem" }}>No data found.</Row>;
    }

    const totalCases = cases ? cases.hits.total : 0;

    return (
      <Loader loading={!cases} height="387px">
        <Row
          style={{
            backgroundColor: "white",
            padding: "1rem",
            justifyContent: "space-between",
            alignItems: "flex-end"
          }}
        >
          <Showing
            docType="cases"
            prefix={"macTable"}
            params={relay.route.params}
            total={totalCases}
          />
          <Row style={{ alignItems: "flex-end" }}>
            <ExploreLink
              query={{ searchTableTab: "cases", filters: defaultFilters }}
            >
              Open in Exploration
            </ExploreLink>
            <TableActions
              currentFilters={defaultFilters}
              style={{ marginLeft: "2rem" }}
              prefix={"cases"}
              total={totalCases}
              endpoint={"case_ssms"}
              downloadFields={[
                "primary_site",
                "case_id",
                "submitter_id",
                "demographic.gender",
                "summary.data_categories.data_category",
                "summary.data_categories.file_count",
                "diagnoses.age_at_diagnosis",
                "diagnoses.tumor_stage",
                "diagnoses.days_to_last_follow_up",
                "diagnoses.days_to_death"
              ]}
              tsvSelector="#most-affected-cases-table"
              tsvFilename="most-affected-cases-table.tsv"
            />
          </Row>
        </Row>
        <EntityPageHorizontalTable
          tableId="most-affected-cases-table"
          headings={[
            { key: "id", title: "UUID" },
            { key: "submitter_id", title: "Submitter ID" },
            { key: "primary_site", title: "Site" },
            { key: "gender", title: "Gender" },
            {
              key: "age_at_diagnosis",
              title: <span>Age at<br />Diagnosis</span>
            },
            { key: "tumor_stage", title: "Stage" },
            {
              key: "days_to_death",
              title: (
                <Tooltip Component="Survival (days)" style={tableToolTipHint()}>
                  Survival
                </Tooltip>
              )
            },
            {
              key: "days_to_last_follow_up",
              title: (
                <Tooltip
                  Component="Days to Last Follow Up"
                  style={tableToolTipHint()}
                >
                  Last Follow<br />Up (days)
                </Tooltip>
              ),
              style: { textAlign: "right", padding: "3px 15px 3px 3px" }
            },
            {
              key: "data_types",
              title: (
                <div style={{ textAlign: "center" }}>
                  Available Files per Data Category
                </div>
              ),
              style: { textAlign: "right" },
              subheadings: Object.keys(DATA_CATEGORIES).map(k => (
                <abbr
                  key={DATA_CATEGORIES[k].abbr}
                  style={{ fontSize: "1rem" }}
                >
                  <Tooltip
                    Component={DATA_CATEGORIES[k].full}
                    style={tableToolTipHint()}
                  >
                    {DATA_CATEGORIES[k].abbr}
                  </Tooltip>
                </abbr>
              ))
            },
            {
              key: "num_mutations",
              title: (
                <Tooltip Component="# SSM" style={tableToolTipHint()}>
                  # Mutations
                </Tooltip>
              ),
              style: { textAlign: "right" }
            },
            {
              key: "num_genes",
              title: (
                <Tooltip
                  Component="# Genes with SSM"
                  style={tableToolTipHint()}
                >
                  # Genes
                </Tooltip>
              ),
              style: { textAlign: "right" }
            }
          ]}
          data={
            !cases
              ? []
              : cases.hits.edges.map(x => x.node).map(c => {
                  const dataCategorySummary = c.summary.data_categories.reduce(
                    (acc, d) => ({
                      ...acc,
                      [d.data_category]: d.file_count
                    }),
                    {}
                  );

                  const diagnosis = (c.diagnoses.hits.edges[0] || { node: {} })
                    .node;

                  return {
                    id: (
                      <span>
                        <CaseLink uuid={c.case_id}>
                          {c.case_id.substr(0, 8)}
                        </CaseLink>
                        <ForTsvExport>
                          {c.case_id}
                        </ForTsvExport>
                      </span>
                    ),
                    submitter_id: c.submitter_id,
                    primary_site: c.primary_site,
                    gender: c.demographic ? c.demographic.gender : "",
                    age_at_diagnosis: ageDisplay(diagnosis.age_at_diagnosis),
                    tumor_stage: diagnosis.tumor_stage,
                    days_to_last_follow_up: diagnosis.days_to_last_follow_up,
                    days_to_death: diagnosis.days_to_death,
                    num_mutations: (
                      <MutationsCount
                        key={c.case_id}
                        ssms={mutationsCountFragment}
                        filters={makeFilter(
                          [{ field: "cases.case_id", value: [c.case_id] }],
                          false
                        )}
                      />
                    ),
                    num_genes: (
                      <ExploreLink
                        query={{
                          searchTableTab: "genes",
                          filters: makeFilter(
                            [{ field: "cases.case_id", value: [c.case_id] }],
                            false
                          )
                        }}
                      >
                        {c.score}
                      </ExploreLink>
                    ),
                    data_types: Object.keys(DATA_CATEGORIES).map(
                      k =>
                        dataCategorySummary[DATA_CATEGORIES[k].full]
                          ? <RepositoryFilesLink
                              query={{
                                filters: makeFilter(
                                  [
                                    {
                                      field: "cases.case_id",
                                      value: c.case_id
                                    },
                                    {
                                      field: "files.data_category",
                                      value: DATA_CATEGORIES[k].full
                                    }
                                  ],
                                  false
                                )
                              }}
                            >
                              {dataCategorySummary[DATA_CATEGORIES[k].full]}
                            </RepositoryFilesLink>
                          : "--"
                    )
                  };
                })
          }
        />
        <Pagination
          prefix={"macTable"}
          params={relay.route.params}
          total={!cases ? 0 : cases.hits.total}
        />
      </Loader>
    );
  }
);

export const MostAffectedCasesTableQuery = {
  initialVariables: {
    fetchData: false,
    score: "gene.gene_id",
    macTable_filters: null,
    macTable_size: 10,
    macTable_offset: 0
  },
  fragments: {
    explore: () => Relay.QL`
      fragment on Explore {
        allCases: cases {
          hits(first: 0) { total }
        }
        mutationsCountFragment: ssms {
          ${MutationsCount.getFragment("ssms")}
        }
        cases @include(if: $fetchData) {
          hits (
            score: $score
            first: $macTable_size
            filters: $macTable_filters
            offset: $macTable_offset
          ) @include(if: $fetchData) {
            total
            edges {
              node {
                primary_site
                score
                case_id
                submitter_id
                demographic {
                  gender
                }
                summary {
                  data_categories {
                    data_category
                    file_count
                  }
                }
                diagnoses {
                  hits(first: 1) {
                    edges {
                      node {
                        age_at_diagnosis
                        tumor_stage
                        days_to_last_follow_up
                        days_to_death
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
  }
};

const MostAffectedCasesTable = Relay.createContainer(
  MostAffectedCasesTableComponent,
  MostAffectedCasesTableQuery
);

export default MostAffectedCasesTable;
