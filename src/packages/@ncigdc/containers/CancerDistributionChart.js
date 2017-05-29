// @flow

import React from "react";
import Relay from "react-relay/classic";
import { lifecycle, compose } from "recompose";
import { sortBy, sum, get } from "lodash";

import withSize from "@ncigdc/utils/withSize";
import withRouter from "@ncigdc/utils/withRouter";
import { makeFilter } from "@ncigdc/utils/filters";
import { Row, Column } from "@ncigdc/uikit/Flex";
import DownloadVisualizationButton
  from "@ncigdc/components/DownloadVisualizationButton";
import { withTheme } from "@ncigdc/theme";
import BarChart from "@ncigdc/components/Charts/BarChart";
import Loader from "@ncigdc/uikit/Loaders/Loader";
import wrapSvg from "@ncigdc/utils/wrapSvg";
import ExploreLink from "@ncigdc/components/Links/ExploreLink";
import ProjectsLink from "@ncigdc/components/Links/ProjectsLink";
import type { TGroupFilter } from "@ncigdc/utils/filters/types";

type TProps = {
  filters: ?TGroupFilter,
  cases: {
    total: {
      project__project_id: {
        buckets: Array<{
          key: string,
          doc_count: number
        }>
      }
    },
    filtered: {
      project__project_id: {
        buckets: Array<{
          key: string,
          doc_count: number
        }>
      }
    }
  },
  ssms: {
    hits: {
      total: number
    }
  },
  aggregations: Object,
  size: {
    width: number
  },
  theme: Object,
  push: Function,
  ChartTitle: ReactClass<{}>
};

const CHART_HEIGHT = 295;
const CHART_MARGINS = { top: 20, right: 50, bottom: 75, left: 40 };
const MAX_BARS = 20;

export type TChartTitleProps = {
  cases: number,
  projects: Array<{ project_id: string }>,
  ssms: number,
  filters: any
};
const DefaultChartTitle = ({
  cases = 0,
  projects = [],
  ssms = 0,
  filters
}: TChartTitleProps) => (
  <h5 style={{ textTransform: "uppercase", padding: "0 2rem" }}>
    <ExploreLink query={{ searchTableTab: "cases", filters }}>
      {cases.toLocaleString()}
    </ExploreLink>&nbsp;
    cases affected by&nbsp;
    <ExploreLink query={{ searchTableTab: "mutations", filters }}>
      {ssms.toLocaleString()}
    </ExploreLink>&nbsp;
    mutations across&nbsp;
    <ProjectsLink
      query={{
        filters: {
          op: "and",
          content: [
            {
              op: "in",
              content: {
                field: "projects.project_id",
                value: projects.map(p => p.project_id)
              }
            }
          ]
        }
      }}
    >
      {projects.length.toLocaleString()}
    </ProjectsLink>&nbsp;
    projects
  </h5>
);

const CancerDistributionChartComponent = compose(
  withSize(),
  withRouter,
  withTheme,
  lifecycle({
    componentDidMount(): void {
      this.props.relay.setVariables({
        fetchFilteredCaseAggs: true,
        caseAggsFilter: this.props.filters
      });
    }
  })
)(
  (
    {
      cases,
      ssms,
      size: { width },
      theme,
      push,
      ChartTitle = DefaultChartTitle,
      filters
    }: TProps = {}
  ) => {
    const casesByProjectMap = (cases.total || {
      project__project_id: []
    }).project__project_id.buckets
      .reduce(
        (acc, bucket) => ({ ...acc, [bucket.key]: bucket.doc_count }),
        {}
      );

    const cancerDistData = (cases.filtered || {
      project__project_id: { buckets: [] }
    }).project__project_id.buckets
      .map(b => {
        const totalCasesByProject = casesByProjectMap[b.key];
        const freq = b.doc_count / totalCasesByProject;

        return {
          freq,
          project_id: b.key,
          num_affected_cases: b.doc_count,
          num_cases_total: totalCasesByProject
        };
      });

    const sortedCancerDistData = sortBy(cancerDistData, d => -d.freq);

    const chartData = sortedCancerDistData.map(d => ({
      label: d.project_id,
      value: d.freq * 100,
      onClick: () => push(`/projects/${d.project_id}`),
      tooltip: (
        <span>
          {d.num_affected_cases.toLocaleString()}&nbsp;
          Case
          {d.num_affected_cases > 1 ? "s" : ""}
          {" "}
          Affected in
          {" "}
          <b>{d.project_id}</b>
          <br />
          {d.num_affected_cases.toLocaleString()}
          {" "}
          /
          {" "}
          {d.num_cases_total.toLocaleString()}&nbsp;
          ({(d.freq * 100).toFixed(2)}%)
        </span>
      )
    }));

    const bandWidth =
      (width - CHART_MARGINS.right - CHART_MARGINS.left) /
      (MAX_BARS + 1) /
      2 *
      0.7;

    return (
      <span>
        {chartData.length >= 5 &&
          <Loader loading={!cases.filtered} height={CHART_HEIGHT}>
            <Column>
              <Row
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "50%"
                }}
              >
                <ChartTitle
                  cases={sum(
                    sortedCancerDistData.map(d => d.num_affected_cases)
                  )}
                  ssms={get(ssms, "hits.total", 0)}
                  projects={sortedCancerDistData}
                  filters={filters}
                />
                <DownloadVisualizationButton
                  svg={() =>
                    wrapSvg({
                      selector: "#cancer-distribution svg",
                      title: "Cancer Distribution"
                    })}
                  data={chartData.map(d => ({
                    label: d.label,
                    value: d.value
                  }))}
                  slug="cancer-distribution-bar-chart"
                  noText
                  tooltipHTML="Download image or data"
                  style={{ marginRight: "2rem" }}
                />
              </Row>

              <Row
                style={{ padding: "0 2rem", justifyContent: "space-between" }}
              >
                <BarChart
                  margin={CHART_MARGINS}
                  bandwidth={bandWidth}
                  data={chartData}
                  yAxis={{ title: "% of Cases Affected" }}
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
            </Column>
          </Loader>}
      </span>
    );
  }
);

const CancerDistributionChartQuery = {
  initialVariables: {
    caseAggsFilter: null,
    fetchFilteredCaseAggs: false,
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
    ssms: () => Relay.QL`
      fragment on Ssms {
        placeholder: hits(first: 0) { total }
        hits(first: 0, filters: $caseAggsFilter) @include(if: $fetchFilteredCaseAggs) {
          total
        }
      }
    `,
    cases: () => Relay.QL`
      fragment on ExploreCases {
        filtered: aggregations(filters: $caseAggsFilter) @include(if: $fetchFilteredCaseAggs) {
          project__project_id {
            buckets {
              doc_count
              key
            }
          }
        }
        total: aggregations(filters: $ssmTested) {
          project__project_id {
            buckets {
              doc_count
              key
            }
          }
        }
      }
    `
  }
};

const CancerDistributionChart = Relay.createContainer(
  CancerDistributionChartComponent,
  CancerDistributionChartQuery
);

export default CancerDistributionChart;
