// @flow
/* eslint fp/no-class:0 */

import React from "react";
import Relay from "react-relay/classic";
import withSize from "@ncigdc/utils/withSize";
import { compose, withHandlers } from "recompose";
import { parse } from "query-string";
import withRouter from "@ncigdc/utils/withRouter";
import { parseFilterParam } from "@ncigdc/utils/uri";
import { viewerQuery } from "@ncigdc/routes/queries";
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

const createRenderer = (Route, Container) =>
  compose(withRouter)((props: mixed) => (
    <Relay.Renderer
      environment={Relay.Store}
      queryConfig={new Route(props)}
      Container={Container}
      render={({ props: relayProps }) =>
        relayProps ? <Container {...relayProps} {...props} /> : undefined // needed to prevent flicker
      }
    />
  ));

class Route extends Relay.Route {
  static routeName = "GenesBarChartRoute";
  static queries = viewerQuery;
  static prepareParams = ({ location: { search }, defaultFilters = null }) => {
    const q = parse(search);

    return {
      genesBarChart_filters: parseFilterParam(
        q.genesBarChart_filters,
        defaultFilters || null
      )
    };
  };
}

const createContainer = Component =>
  Relay.createContainer(Component, {
    initialVariables: {
      genesBarChart_filters: null,
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
      viewer: () => Relay.QL`
        fragment on Root {
          explore {
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
            filteredCases: cases {
              hits(first: 0 filters: $genesBarChart_filters) {
                total
              }
            }
            genes {
              hits (first: 20 filters: $genesBarChart_filters, score: $score) {
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
        }
      `
    }
  });

const Component = compose(
  withRouter,
  withHandlers({
    handleClickGene: ({ push, onClickGene }) => (gene, chartData) =>
      onClickGene
        ? onClickGene(gene, chartData)
        : push(`/genes/${gene.gene_id}`)
  }),
  withTheme,
  withSize()
)(
  ({
    projectId = "",
    theme,
    size: { width },
    viewer: {
      explore: { genes = { hits: { edges: [] } }, cases, filteredCases }
    },
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

export default createRenderer(Route, createContainer(Component));
