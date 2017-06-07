/* @flow */
/* eslint fp/no-class:0 */

import React from "react";
import Relay from "react-relay/classic";
import { compose, withState } from "recompose";
import { withRouter } from "react-router-dom";
import { startCase, truncate, get, orderBy } from "lodash";
import { connect } from "react-redux";
import { parse } from "query-string";
import { scaleOrdinal, schemeCategory10 } from "d3";
import { handleReadyStateChange } from "@ncigdc/dux/loaders";
import {
  parseIntParam,
  parseFilterParam,
  parseJSURLParam
} from "@ncigdc/utils/uri";
import { viewerQuery } from "@ncigdc/routes/queries";
import GeneLink from "@ncigdc/components/Links/GeneLink";
import MutationLink from "@ncigdc/components/Links/MutationLink";
import withSize from "@ncigdc/utils/withSize";
import withBetterRouter from "@ncigdc/utils/withRouter";
import { makeFilter, addInFilters } from "@ncigdc/utils/filters";
import Showing from "@ncigdc/components/Pagination/Showing";
import EntityPageHorizontalTable
  from "@ncigdc/components/EntityPageHorizontalTable";
import { ConnectedLoader } from "@ncigdc/uikit/Loaders/Loader";
import BubbleIcon from "@ncigdc/theme/icons/BubbleIcon";
import { Row } from "@ncigdc/uikit/Flex";
import { Tooltip } from "@ncigdc/uikit/Tooltip";
import Button from "@ncigdc/uikit/Button";
import { tableToolTipHint } from "@ncigdc/theme/mixins";
import { SpinnerIcon } from "@ncigdc/theme/icons";
import Hidden from "@ncigdc/components/Hidden";
import Pagination from "@ncigdc/components/Pagination";
import SurvivalIcon from "@ncigdc/theme/icons/SurvivalIcon";
import { getSurvivalCurves } from "@ncigdc/utils/survivalplot";
import ProjectBreakdown
  from "@ncigdc/modern_components/ProjectBreakdown/ProjectBreakdown";
import ExploreLink from "@ncigdc/components/Links/ExploreLink";
import { ForTsvExport } from "@ncigdc/components/DownloadTableToTsvButton";
import { withTheme } from "@ncigdc/theme";
import type { TTheme } from "@ncigdc/theme";
import type { TGroupFilter } from "@ncigdc/utils/filters/types";
import TableActions from "@ncigdc/components/TableActions";

const colors = scaleOrdinal(schemeCategory10);
const COMPONENT_NAME = "SsmsTable";

const createRenderer = (Route, Container) =>
  compose(connect(), withRouter)((props: mixed) => (
    <div style={{ position: "relative", minHeight: "387px" }}>
      <Relay.Renderer
        environment={Relay.Store}
        queryConfig={new Route(props)}
        onReadyStateChange={handleReadyStateChange(COMPONENT_NAME, props)}
        Container={Container}
        render={({ props: relayProps }) =>
          relayProps ? <Container {...relayProps} {...props} /> : undefined // needed to prevent flicker
        }
      />
      <ConnectedLoader name={COMPONENT_NAME} />
    </div>
  ));

class Route extends Relay.Route {
  static routeName = COMPONENT_NAME;
  static queries = viewerQuery;
  static prepareParams = ({
    location: { search },
    defaultSize = 10,
    defaultFilters = null
  }) => {
    const q = parse(search);

    return {
      ssmsTable_filters: parseFilterParam(q.ssmsTable_filters, defaultFilters),
      ssmsTable_offset: parseIntParam(q.ssmsTable_offset, 0),
      ssmsTable_size: parseIntParam(q.ssmsTable_size, defaultSize),
      ssmsTable_sort: parseJSURLParam(q.ssmsTable_sort, null),
      ssmCaseFilter: addInFilters(
        q.ssmsTable_filters || defaultFilters,
        makeFilter([
          {
            field: "available_variation_data",
            value: "ssm"
          }
        ])
      )
    };
  };
}

const createContainer = Component =>
  Relay.createContainer(Component, {
    initialVariables: {
      score: "occurrence.case.project.project_id",
      ssmsTable_filters: null,
      ssmsTable_size: 10,
      ssmsTable_offset: 0,
      consequenceFilters: {
        op: "NOT",
        content: {
          field: "consequence.transcript.annotation.impact",
          value: "missing"
        }
      },
      ssmCaseFilter: null,
      ssmTested: makeFilter([
        {
          field: "cases.available_variation_data",
          value: "ssm"
        }
      ]),
      sort: [
        { field: "_score", order: "desc" },
        { field: "_uid", order: "asc" }
      ]
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Root {
          explore {
            cases { hits(first: 0 filters: $ssmTested) { total }}
            filteredCases: cases {
              hits(first: 0 filters: $ssmCaseFilter) {
                total
              }
            }
            ssms {
              hits(first: $ssmsTable_size offset: $ssmsTable_offset filters: $ssmsTable_filters, score: $score, sort: $sort) {
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
        }
      `
    }
  });

type TProps = {
  showSurvivalPlot: boolean,
  selectedSurvivalData: {
    id: string
  },
  context?: string,
  setSelectedSurvivalData: Function,
  viewer: {
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
    ssmsTable_offset: string,
    ssmsTable_size: string,
    ssmsTable_filters: string
  },
  defaultFilters: TGroupFilter
};

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

const Component = compose(
  withBetterRouter,
  withState("survivalLoadingId", "setSurvivalLoadingId", ""),
  withTheme,
  withSize()
)(
  (
    {
      defaultFilters,
      showSurvivalPlot = false,
      hasEnoughSurvivalDataOnPrimaryCurve,
      selectedSurvivalData = { id: "" },
      setSelectedSurvivalData = () => {},
      viewer: { explore: { ssms, filteredCases, cases } },
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
      <span>
        <Row
          style={{
            backgroundColor: "white",
            padding: "1rem",
            justifyContent: "space-between",
            alignItems: "flex-end"
          }}
        >
          <Showing
            docType="somatic mutations"
            prefix="ssmsTable"
            params={relay.variables}
            total={totalSsms}
          />
          <Row style={{ alignItems: "flex-end" }}>
            {tableLink}
            <TableActions
              currentFilters={query.ssmsTable_filters || defaultFilters}
              style={{ marginLeft: "2rem" }}
              prefix={prefix}
              total={totalSsms}
              endpoint={prefix}
              downloadTooltip="Export All Except #Cases"
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
          idKey="ssm_id"
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
                      Breakdown of Cases Affected by Simple Somatic Mutations
                      in&nbsp;
                      {context}<br />
                      # of Cases where Mutation is observed / # of Cases tested for Simple Somatic Mutations
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
                      / # Cases tested for Simple Somatic Mutations portal wide
                      <br />
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
                      makeFilter([{ field: "ssms.ssm_id", value: x.ssm_id }])
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
                      ? query.ssmsTable_filters || defaultFilters
                      : addInFilters(
                          query.ssmsTable_filters || defaultFilters,
                          makeFilter([
                            {
                              field: "cases.available_variation_data",
                              value: ["ssm"]
                            }
                          ])
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
                filters={makeFilter([
                  { field: "ssms.ssm_id", value: x.ssm_id }
                ])}
                caseTotal={x.occurrence.hits.total}
                gdcCaseTotal={cases.hits.total}
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
                      Component={
                        hasEnoughSurvivalDataOnPrimaryCurve
                          ? `Click icon to plot ${x.genomic_dna_change}`
                          : "Not enough survival data"
                      }
                    >
                      <Button
                        style={{
                          padding: "2px 3px",
                          backgroundColor: hasEnoughSurvivalDataOnPrimaryCurve
                            ? colors(
                                selectedSurvivalData.id === x.ssm_id ? 1 : 0
                              )
                            : "#666",
                          color: "white",
                          margin: "0 auto"
                        }}
                        disabled={!hasEnoughSurvivalDataOnPrimaryCurve}
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
          prefix="ssmsTable"
          params={relay.variables}
          total={!ssms ? 0 : ssms.hits.total}
        />
      </span>
    );
  }
);

export default createRenderer(Route, createContainer(Component));
