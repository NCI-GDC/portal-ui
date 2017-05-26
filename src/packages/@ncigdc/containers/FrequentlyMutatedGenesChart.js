// @flow

import React from "react";
import Relay from "react-relay/classic";
import withSize from "@ncigdc/utils/withSize";
import { compose, withPropsOnChange, withHandlers } from "recompose";
import { isEqual } from "lodash";
import withRouter from "@ncigdc/utils/withRouter";
import { parseFilterParam } from "@ncigdc/utils/uri";
import { makeFilter } from "@ncigdc/utils/filters";
import Loader from "@ncigdc/uikit/Loaders/Loader";
import { withTheme } from "@ncigdc/theme";
import { Row, Column } from "@ncigdc/uikit/Flex";
import DownloadVisualizationButton
  from "@ncigdc/components/DownloadVisualizationButton";
import BarChart from "@ncigdc/components/Charts/BarChart";
import wrapSvg from "@ncigdc/utils/wrapSvg";
import VisualizationHeader from "@ncigdc/components/VisualizationHeader";

const TITLE = "Distribution of Most Frequently Mutated Genes";
const CHART_HEIGHT = 285;
const CHART_MARGINS = { top: 20, right: 50, bottom: 65, left: 55 };
const MAX_BARS = 20;

const FrequentlyMutatedGenesChartComponent = compose(
  withRouter,
  withHandlers({
    handleClickGene: ({ push, onClickGene }) => (gene, chartData) =>
      onClickGene
        ? onClickGene(gene, chartData)
        : push(`/genes/${gene.gene_id}`)
  }),
  withPropsOnChange(
    (props, nextProps) =>
      ["query", "projectId", "defaultFilters"].some(
        propName => !isEqual(props[propName], nextProps[propName])
      ),
    ({ relay, query, defaultFilters }) => {
      relay.setVariables({
        fetchData: true,
        fmgChart_filters: parseFilterParam(
          query.fmgChart_filters,
          defaultFilters || null
        )
      });
    }
  ),
  withTheme,
  withSize()
)(
  ({
    projectId = "",
    theme,
    size: { width },
    explore: { genes = { hits: { edges: [] } }, cases, filteredCases },
    push,
    showSurvivalPlot = true,
    context = "explore",
    handleClickGene
  }) => {
    const bandWidth =
      (width - CHART_MARGINS.right - CHART_MARGINS.left) /
      (MAX_BARS + 1) /
      (showSurvivalPlot ? 1 : 2) *
      0.7;

    const numCasesAggByProject = cases.aggregations.project__project_id.buckets.reduce(
      (acc, b) => ({
        ...acc,
        [b.key]: b.doc_count
      }),
      {}
    );

    const tooltipContext = (ctx, { symbol, score = 0 }) => {
      switch (ctx) {
        case "project": {
          return (
            <span>
              <b>{symbol}</b><br />
              {score.toLocaleString()}
              {" "}
              Case
              {score > 1 ? "s" : ""}
              {" "}
              affected in
              {" "}
              {projectId}
              <br />
              {score.toLocaleString()}
              {" "}
              /
              {" "}
              {(numCasesAggByProject[projectId] || 0).toLocaleString()}
              &nbsp;(
              {(score / numCasesAggByProject[projectId] * 100).toFixed(2)}
              %)
            </span>
          );
        }
        case "explore": {
          return (
            <span>
              <b>{symbol}</b><br />
              {score.toLocaleString()}
              {" "}
              Case
              {score > 1 ? "s" : ""}
              {" "}
              affected in explore
              <br />
              {score.toLocaleString()}
              {" "}
              /
              {" "}
              {(filteredCases.hits.total || 0).toLocaleString()}
              &nbsp;({(score / filteredCases.hits.total * 100).toFixed(2)}%)
            </span>
          );
        }
        default: {
          return <span />;
        }
      }
    };
    const geneNodes = genes.hits.edges.map(x => x.node);
    const mutatedGenesChartData = geneNodes // eslint-disable-line fp/no-mutating-methods
      .sort((a, b) => b.score - a.score)
      .map(g => ({
        label: g.symbol,
        value: context === "project" && projectId
          ? g.score / numCasesAggByProject[projectId] * 100
          : g.score / filteredCases.hits.total * 100,
        tooltip: tooltipContext(context, g),
        onClick: () => handleClickGene(g, mutatedGenesChartData)
      }));

    return (
      <Loader loading={!genes} height={CHART_HEIGHT}>
        {!!mutatedGenesChartData &&
          <Column>
            <VisualizationHeader
              title={TITLE}
              buttons={[
                <DownloadVisualizationButton
                  key="download"
                  disabled={!mutatedGenesChartData.length}
                  svg={() =>
                    wrapSvg({
                      selector: "#mutated-genes-chart svg",
                      title: TITLE
                    })}
                  data={mutatedGenesChartData.map(d => ({
                    label: d.label,
                    value: d.value
                  }))}
                  slug="most-frequently-mutated-genes-bar-chart"
                  tooltipHTML="Download image or data"
                  noText
                />
              ]}
            />
            {!!mutatedGenesChartData.length &&
              <div id="mutated-genes-chart">
                <Row style={{ padding: "2rem 2rem 0" }}>
                  <BarChart
                    data={mutatedGenesChartData}
                    yAxis={{ title: "% of Cases Affected" }}
                    bandwidth={bandWidth}
                    margin={CHART_MARGINS}
                    height={CHART_HEIGHT}
                    styles={{
                      xAxis: {
                        stroke: theme.greyScale4,
                        textFill: theme.greyScale3
                      },
                      yAxis: {
                        stroke: theme.greyScale4,
                        textFill: theme.greyScale3
                      },
                      bars: { fill: theme.secondary },
                      tooltips: {
                        fill: "#fff",
                        stroke: theme.greyScale4,
                        textFill: theme.greyScale3
                      }
                    }}
                  />
                </Row>
              </div>}
          </Column>}
      </Loader>
    );
  }
);

export const FrequentlyMutatedGenesChartQuery = {
  initialVariables: {
    fetchData: false,
    fmgChart_filters: null,
    score: "case.project.project_id",
    ssmTested: makeFilter(
      [
        {
          field: "cases.available_variation_data",
          value: "ssm"
        }
      ],
      false
    )
  },
  fragments: {
    explore: () => Relay.QL`
      fragment on Explore {
        cases {
          aggregations(filters: $ssmTested) {
            project__project_id {
              buckets {
                doc_count
                key
              }
            }
          }
          hits(first: 0) { total }
        }
        filteredCases: cases @include(if: $fetchData) {
          hits(first: 0 filters: $fmgChart_filters) {
            total
          }
        }
        genes @include(if: $fetchData) {
          hits (first: 20 filters: $fmgChart_filters, score: $score) @include(if: $fetchData) {
            total
            edges {
              node {
                id
                score
                symbol
                gene_id
                case {
                  hits(first: 1) {
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

const FrequentlyMutatedGenesChart = Relay.createContainer(
  FrequentlyMutatedGenesChartComponent,
  FrequentlyMutatedGenesChartQuery
);

export default FrequentlyMutatedGenesChart;
