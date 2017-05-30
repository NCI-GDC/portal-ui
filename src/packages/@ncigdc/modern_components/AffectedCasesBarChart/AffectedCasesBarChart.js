// @flow

import React from "react";
import Relay from "react-relay/classic";
import withSize from "@ncigdc/utils/withSize";
import { parse } from "query-string";
import { compose } from "recompose";
import withRouter from "@ncigdc/utils/withRouter";
import { viewerQuery } from "@ncigdc/routes/queries";
import { parseFilterParam } from "@ncigdc/utils/uri";
import { Row, Column } from "@ncigdc/uikit/Flex";
import BarChart from "@ncigdc/components/Charts/BarChart";
import { withTheme } from "@ncigdc/theme";
import Loader from "@ncigdc/uikit/Loaders/Loader";
import DownloadVisualizationButton
  from "@ncigdc/components/DownloadVisualizationButton";
import wrapSvg from "@ncigdc/utils/wrapSvg";

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
  static routeName = "AffectedCasesBarChartRoute";
  static queries = viewerQuery;
  static prepareParams = ({ location: { search }, defaultFilters = null }) => {
    const q = parse(search);

    return {
      affectedCasesBarChart_filters: parseFilterParam(
        q.affectedCasesBarChart_filters,
        defaultFilters || null
      )
    };
  };
}

const createContainer = Component =>
  Relay.createContainer(Component, {
    initialVariables: {
      affectedCasesBarChart_filters: null,
      score: "gene.gene_id"
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Root {
          explore {
            allCases: cases {
              hits(first: 0) { total }
            }
            cases {
              hits (first: 20 filters: $affectedCasesBarChart_filters, score: $score) {
                total
                edges {
                  node {
                    score
                    case_id
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
  withTheme,
  withSize(),
  withRouter
)(
  ({
    viewer: { explore: { cases = { hits: { edges: [] } } } },
    theme,
    size: { width },
    push
  }) => {
    const bandWidth =
      (width - CHART_MARGINS.right - CHART_MARGINS.left) /
      (MAX_BARS + 1) /
      2 *
      0.7;

    const chartData = cases.hits.edges.map(x => x.node).map(c => ({
      fullLabel: c.case_id,
      label: `${c.case_id.substring(0, 8)}\u2026`,
      value: c.score,
      tooltip: (
        <span>{c.case_id}<br />{c.score.toLocaleString()} Genes Affected</span>
      ),
      onClick: () => push(`/cases/${c.case_id}`)
    }));

    return (
      <Loader loading={!cases} height={CHART_HEIGHT}>
        <Column>
          {cases &&
            !!cases.hits.edges.length &&
            <Row style={{ width: "50%", justifyContent: "flex-end" }}>
              <DownloadVisualizationButton
                svg={() =>
                  wrapSvg({
                    selector: "#most-affected-cases svg",
                    title: "Most Affected Cases"
                  })}
                data={chartData.map(d => ({
                  label: d.fullLabel,
                  value: d.value
                }))}
                slug="most-affected-cases-bar-chart"
                noText
                tooltipHTML="Download image or data"
                style={{ marginRight: "2rem" }}
              />
            </Row>}
          {cases &&
            !!cases.hits.edges.length &&
            <Row style={{ padding: "0 2rem" }} id="most-affected-cases">
              <BarChart
                data={chartData}
                margin={CHART_MARGINS}
                height={CHART_HEIGHT}
                bandwidth={bandWidth}
                yAxis={{ title: "# Affected Genes" }}
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
            </Row>}
        </Column>
      </Loader>
    );
  }
);

export default createRenderer(Route, createContainer(Component));
