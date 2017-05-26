// @flow

import React from "react";
import Relay from "react-relay/classic";
import withSize from "@ncigdc/utils/withSize";
import { startCase, truncate, isEqual, get, orderBy } from "lodash";
import { compose, withState, withPropsOnChange } from "recompose";
import { scaleOrdinal, schemeCategory10 } from "d3";
import { parseIntParam, parseFilterParam } from "@ncigdc/utils/uri";
import Showing from "@ncigdc/components/Pagination/Showing";
import { withTheme } from "@ncigdc/theme";
import { tableToolTipHint } from "@ncigdc/theme/mixins";
import Loader from "@ncigdc/uikit/Loaders/Loader";
import GeneLink from "@ncigdc/components/Links/GeneLink";
import withRouter from "@ncigdc/utils/withRouter";
import MutationLink from "@ncigdc/components/Links/MutationLink";
import { makeFilter, addInFilters } from "@ncigdc/utils/filters";
import EntityPageHorizontalTable
  from "@ncigdc/components/EntityPageHorizontalTable";
import SurvivalIcon from "@ncigdc/theme/icons/SurvivalIcon";
import { Row } from "@ncigdc/uikit/Flex";
import Button from "@ncigdc/uikit/Button";
import { Tooltip } from "@ncigdc/uikit/Tooltip";
import Pagination from "@ncigdc/components/Pagination";
import { getSurvivalCurves } from "@ncigdc/utils/survivalplot";
import Hidden from "@ncigdc/components/Hidden";
import BubbleIcon from "@ncigdc/theme/icons/BubbleIcon";
import { SpinnerIcon } from "@ncigdc/theme/icons";
import type { TGroupFilter } from "@ncigdc/utils/filters/types";
import ProjectBreakdown from "@ncigdc/containers/ProjectBreakdown";
import type { TTheme } from "@ncigdc/theme";
import ExploreLink from "@ncigdc/components/Links/ExploreLink";
import { ForTsvExport } from "@ncigdc/components/DownloadTableToTsvButton";
import TableActions from "@ncigdc/components/TableActions";

type TProps = {
  showSurvivalPlot: boolean,
  selectedSurvivalData: {
    id: string
  },
  context?: string,
  setSelectedSurvivalData: Function,
  explore: {
    ssms: {
      hits: {
        total: number,
        edges: Array<{
          node: {}
        }>
      }
    },
    filteredCases: {
      hits: {
        total: number
      }
    }
  },
  projectBreakdown: Object,
  shouldShowGeneSymbol: boolean,
  relay: {
    route: {
      params: {}
    },
    variables: Object
  },
  setSurvivalLoadingId: Function,
  survivalLoadingId: string,
  theme: TTheme,
  query: {
    fmTable_offset: string,
    fmTable_size: string,
    fmTable_filters: string
  },
  defaultFilters: TGroupFilter
};
const colors = scaleOrdinal(schemeCategory10);

const mutationSubTypeMap = {
  "single base substitution": "Substitution",
  "small deletion": "Deletion",
  "small insertion": "Insertion"
};

type TMapData = (
  data: Array<Object>,
  shouldShowGeneSymbol: boolean,
  theme: Object
) => Array<Object>;

const mapData: TMapData = (data, shouldShowGeneSymbol, theme) =>
  data.map(hit => {
    const consequenceOfInterest = hit.consequence.hits.edges.find(
      consequence => get(consequence, "node.transcript.annotation.impact"),
      {}
    ) || {};
    const { transcript } = consequenceOfInterest.node || {};
    const {
      annotation = {},
      consequence_type: consequenceType = "",
      gene = {},
      aa_change: aaChange
    } = transcript || {};
    const { symbol, gene_id: geneId } = gene;
    const impact = annotation.impact;

    return {
      ...hit,
      impact,
      mutation_subtype: mutationSubTypeMap[
        (hit.mutation_subtype || "").toLowerCase()
      ] || hit.mutation_subtype,
      consequence_type: (
        <span>
          <b>{startCase(consequenceType.replace("variant", ""))}</b>&nbsp;
          {shouldShowGeneSymbol && <GeneLink uuid={geneId}>{symbol}</GeneLink>}
          <Tooltip
            Component={
              <div style={{ maxWidth: 300, wordBreak: "break-all" }}>
                {aaChange}
              </div>
            }
            style={{
              color: theme.impacts[impact] || "inherit"
            }}
          >
            &nbsp;
            {truncate(aaChange, { length: 12 })}
          </Tooltip>
        </span>
      )
    };
  });

const FrequentMutationsTableComponent = compose(
  withRouter,
  withState("survivalLoadingId", "setSurvivalLoadingId", ""),
  withPropsOnChange(
    (props, nextProps) =>
      ["query", "defaultFilters"].some(
        propName => !isEqual(props[propName], nextProps[propName])
      ),
    ({ relay, query, defaultFilters }) => {
      relay.setVariables({
        fetchData: true,
        fmTable_offset: parseIntParam(query.fmTable_offset, 0),
        fmTable_size: parseIntParam(query.fmTable_size, 10),
        fmTable_filters: parseFilterParam(
          query.fmTable_filters,
          defaultFilters || null
        ),
        ssmCaseFilter: addInFilters(
          query.fmTable_filters || defaultFilters,
          makeFilter(
            [
              {
                field: "available_variation_data",
                value: "ssm"
              }
            ],
            false
          )
        )
      });
      // PRTL-1153 relay vars set correctly but fragment not being resent after 'Clear' button clicked unless forceFetch
      relay.forceFetch();
    }
  ),
  withTheme,
  withSize()
)(
  (
    {
      defaultFilters,
      showSurvivalPlot = false,
      selectedSurvivalData = { id: "" },
      setSelectedSurvivalData = () => {},
      explore: { ssms, filteredCases },
      shouldShowGeneSymbol = true,
      relay,
      setSurvivalLoadingId,
      survivalLoadingId,
      theme,
      projectBreakdown,
      context = "explore",
      query,
      location,
      tableLink
    }: TProps = {}
  ) => {
    if (ssms && !ssms.hits.edges.length) {
      return <Row style={{ padding: "1rem" }}>No mutation data found.</Row>;
    }

    // Data has to be sorted because the relay cache does not store the order.
    const frequentMutations = mapData(
      ssms
        ? orderBy(
            ssms.hits.edges.map(x => x.node),
            ["score", "ssm_id"],
            ["desc", "asc"]
          )
        : [],
      shouldShowGeneSymbol,
      theme
    );

    const prefix = "ssms";
    const totalSsms = ssms ? ssms.hits.total : 0;

    return (
      <Loader loading={!ssms} height="387px">
        <Row
          style={{
            backgroundColor: "white",
            padding: "1rem",
            justifyContent: "space-between",
            alignItems: "flex-end"
          }}
        >
          <Showing
            docType="mutations"
            prefix={"fmTable"}
            params={relay.variables}
            total={totalSsms}
          />
          <Row style={{ alignItems: "flex-end" }}>
            {tableLink}
            <TableActions
              currentFilters={query.fmgTable_filters || defaultFilters}
              style={{ marginLeft: "2rem" }}
              prefix={prefix}
              total={totalSsms}
              endpoint={prefix}
              downloadFields={[
                "genomic_dna_change",
                "mutation_subtype",
                "consequence.transcript.consequence_type",
                "consequence.transcript.annotation.impact",
                "consequence.transcript.is_canonical",
                "consequence.transcript.gene.gene_id",
                "consequence.transcript.gene.symbol",
                "consequence.transcript.aa_change",
                "ssm_id"
              ]}
              tsvSelector="#frequent-mutations-table"
              tsvFilename="frequent-mutations.tsv"
            />
          </Row>
        </Row>
        <EntityPageHorizontalTable
          tableId="frequent-mutations-table"
          headings={[
            {
              key: "mutation_uuid",
              title: "Mutation ID"
            },
            {
              key: "genomic_dna_change",
              title: (
                <Tooltip
                  Component={
                    <span>
                      Genomic DNA change, shown as <br />
                      {"{chromosome}:g{start}{ref}>{tumor}"}
                    </span>
                  }
                  style={tableToolTipHint()}
                >
                  DNA Change
                </Tooltip>
              ),
              className: "id-cell"
            },
            { key: "mutation_subtype", title: "Type" },
            { key: "consequence_type", title: "Consequences" },
            {
              key: "filteredCases",
              title: (
                <Tooltip
                  Component={
                    <span>
                      Breakdown of Cases Affected by SSM in {context} <br />
                      # of Cases where Mutation is observed / # of SSM tested Cases
                    </span>
                  }
                  style={tableToolTipHint()}
                >
                  # Affected Cases<br />in {context}
                </Tooltip>
              )
            },
            {
              key: "projectBreakdown",
              title: (
                <Tooltip
                  Component={
                    <span>
                      # of Cases where Mutation is observed<br />
                      / # SSM tested Cases portal wide<br />
                      Expand to see breakdown by project
                    </span>
                  }
                  style={tableToolTipHint()}
                >
                  # Affected Cases<br /> Across the GDC
                </Tooltip>
              )
            },
            {
              key: "impact",
              title: <span>Impact<br />(VEP)</span>,
              style: { textAlign: "center" }
            },
            ...(showSurvivalPlot
              ? [
                  {
                    title: <span>Survival<br />Analysis</span>,
                    key: "survival_plot",
                    style: { textAlign: "center", width: "100px" }
                  }
                ]
              : [])
          ]}
          data={frequentMutations.map(({ score = 0, ...x }) => ({
            // eslint-disable-line
            ...x,
            mutation_uuid: (
              <span>
                <MutationLink uuid={x.ssm_id}>
                  {x.ssm_id.substr(0, 8)}
                </MutationLink>
                <ForTsvExport>
                  {x.ssm_id}
                </ForTsvExport>
              </span>
            ),
            genomic_dna_change: (
              <Tooltip
                Component={
                  <div style={{ maxWidth: 300, wordBreak: "break-all" }}>
                    {x.genomic_dna_change}
                  </div>
                }
              >
                {truncate(x.genomic_dna_change, { length: 22 })}
              </Tooltip>
            ),
            filteredCases: (
              <span>
                <ExploreLink
                  merge
                  query={{
                    searchTableTab: "cases",
                    filters: addInFilters(
                      query.fmgTable_filters || defaultFilters,
                      makeFilter(
                        [{ field: "ssms.ssm_id", value: x.ssm_id }],
                        false
                      )
                    )
                  }}
                >
                  {score.toLocaleString()}
                </ExploreLink>
                <span> / </span>
                <ExploreLink
                  query={{
                    searchTableTab: "cases",
                    filters: location.pathname.split("/")[1] === "genes"
                      ? query.fmgTable_filters || defaultFilters
                      : addInFilters(
                          query.fmgTable_filters || defaultFilters,
                          makeFilter(
                            [
                              {
                                field: "cases.available_variation_data",
                                value: ["ssm"]
                              }
                            ],
                            false
                          )
                        )
                  }}
                >
                  {(filteredCases.hits.total || 0).toLocaleString()}
                </ExploreLink>
                <span>
                  &nbsp;({(score / filteredCases.hits.total * 100).toFixed(2)}%)
                </span>
              </span>
            ),
            projectBreakdown: (
              <ProjectBreakdown
                filters={makeFilter(
                  [{ field: "ssms.ssm_id", value: x.ssm_id }],
                  false
                )}
                explore={projectBreakdown}
                caseTotal={x.occurrence.hits.total}
              />
            ),
            impact: !["LOW", "MODERATE", "HIGH", "MODIFIER"].includes(x.impact)
              ? null
              : <span>
                  <BubbleIcon
                    toolTipText={x.impact}
                    text={x.impact.slice(0, x.impact === "MODIFIER" ? 2 : 1)}
                    backgroundColor={theme.impacts[x.impact]}
                  />
                  <ForTsvExport>
                    {x.impact}
                  </ForTsvExport>
                </span>,
            ...(showSurvivalPlot
              ? {
                  survival_plot: (
                    <Tooltip
                      Component={`Click icon to plot ${x.genomic_dna_change}`}
                    >
                      <Button
                        style={{
                          padding: "2px 3px",
                          backgroundColor: colors(
                            selectedSurvivalData.id === x.ssm_id ? 1 : 0
                          ),
                          color: "white",
                          margin: "0 auto"
                        }}
                        onClick={() => {
                          if (x.ssm_id !== selectedSurvivalData.id) {
                            setSurvivalLoadingId(x.ssm_id);
                            getSurvivalCurves({
                              field: "gene.ssm.ssm_id",
                              value: x.ssm_id,
                              slug: x.ssm_id.substr(0, 8),
                              currentFilters: defaultFilters
                            }).then(data => {
                              setSelectedSurvivalData(data);
                              setSurvivalLoadingId("");
                            });
                          } else {
                            setSelectedSurvivalData({});
                          }
                        }}
                      >
                        {survivalLoadingId === x.ssm_id
                          ? <SpinnerIcon />
                          : <SurvivalIcon />}
                        <Hidden>add to survival plot</Hidden>
                      </Button>
                    </Tooltip>
                  )
                }
              : {})
          }))}
        />
        <Pagination
          prefix={"fmTable"}
          params={relay.variables}
          total={!ssms ? 0 : ssms.hits.total}
        />
      </Loader>
    );
  }
);

export const FrequentMutationsTableQuery = {
  initialVariables: {
    fetchData: false,
    score: "occurrence.case.project.project_id",
    fmTable_filters: null,
    fmTable_size: 10,
    fmTable_offset: 0,
    consequenceFilters: {
      op: "NOT",
      content: {
        field: "consequence.transcript.annotation.impact",
        value: "missing"
      }
    },
    ssmCaseFilter: null,
    ssmTested: makeFilter(
      [
        {
          field: "cases.available_variation_data",
          value: "ssm"
        }
      ],
      false
    ),
    sort: [{ field: "_score", order: "desc" }, { field: "_uid", order: "asc" }]
  },
  fragments: {
    explore: () => Relay.QL`
      fragment on Explore {
        x: cases { hits(first: 0) { total }}
        filteredCases: cases @include(if: $fetchData) {
          hits(first: 0 filters: $ssmCaseFilter) {
            total
          }
        }
        ssms @include (if: $fetchData) {
          hits(first: $fmTable_size offset: $fmTable_offset filters: $fmTable_filters, score: $score, sort: $sort) {
            total
            edges {
              node {
                score
                genomic_dna_change
                mutation_subtype
                ssm_id
                consequence {
                  hits(first: 1 filters: $consequenceFilters) {
                    edges {
                      node {
                        transcript {
                          is_canonical
                          annotation {
                            impact
                          }
                          consequence_type
                          gene {
                            gene_id
                            symbol
                          }
                          aa_change
                        }
                      }
                    }
                  }
                }
                occurrence {
                  hits(first: 0 filters: $ssmTested) {
                    total
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

const FrequentMutationsTable = Relay.createContainer(
  FrequentMutationsTableComponent,
  FrequentMutationsTableQuery
);

export default FrequentMutationsTable;
