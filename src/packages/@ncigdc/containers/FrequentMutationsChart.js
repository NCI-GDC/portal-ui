// @flow

import React from 'react';
import Relay from 'react-relay/classic';
import withSize from '@ncigdc/utils/withSize';
import { isEqual, orderBy } from 'lodash';
import { compose, withPropsOnChange, withHandlers } from 'recompose';
import withRouter from '@ncigdc/utils/withRouter';
import { parseFilterParam } from '@ncigdc/utils/uri';
import { makeFilter } from '@ncigdc/utils/filters';
import { withTheme } from '@ncigdc/theme';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Loader from '@ncigdc/uikit/Loaders/Loader';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import BarChart from '@ncigdc/components/Charts/BarChart';
import wrapSvg from '@ncigdc/utils/wrapSvg';
import VisualizationHeader from '@ncigdc/components/VisualizationHeader';

const TITLE = 'Distribution of Most Frequent Mutations';
const CHART_HEIGHT = 285;
const CHART_MARGINS = { top: 20, right: 50, bottom: 65, left: 55 };
const MAX_BARS = 20;

const FrequentMutationsChartComponent = compose(
  withRouter,
  withHandlers({
    handleClickMutation: ({ push, onClickMutation }) => (ssm, chartData) => (
      onClickMutation
        ? onClickMutation(ssm, chartData)
        : push(`/ssms/${ssm.ssm_id}`)
      ),
  }),
  withPropsOnChange(
    (props, nextProps) => ['query', 'projectId', 'defaultFilters']
      .some((propName) => !isEqual(props[propName], nextProps[propName])),
    ({ relay, query, defaultFilters }) => {
      relay.setVariables({
        fetchData: true,
        fmChart_filters: parseFilterParam(
          query.fmChart_filters,
          defaultFilters || null
        ),
      });
    }
  ),
  withTheme,
  withSize()
)(({
  theme,
  showSurvivalPlot,
  size: {
    width,
  },
  explore: { ssms = { hits: { edges: [] } }, filteredCases },
  context,
  handleClickMutation,
}) => {
  const bandWidth = (
    (width - CHART_MARGINS.right - CHART_MARGINS.left) /
    (MAX_BARS + 1) / (showSurvivalPlot ? 1 : 2)
  ) * 0.7;

  // Data has to be sorted because the relay cache does not store the order.
  const chartData = orderBy(ssms.hits.edges.map(e => e.node), ['score', 'ssm_id'], ['desc', 'asc'])
  .map(({ score = 0, ssm_id: ssmId }) => ({
    fullLabel: ssmId,
    label: `${ssmId.substr(0, 8)}...`,
    value: score,
    tooltip: (
      <span>
        <b>{ssmId}</b><br />
        <div>{score.toLocaleString()} Case{score > 1 ?
          's' : ''}
        &nbsp;affected in {context}</div>
        {!!filteredCases.hits.total &&
          <div>
            <span>{score.toLocaleString()}</span>
            <span> / </span>
            <span>{filteredCases.hits.total.toLocaleString()}</span>
            <span>&nbsp;({
              ((score / filteredCases.hits.total) * 100).toFixed(2)
            }%)</span>
          </div>
        }
      </span>
    ),
    onClick: () => handleClickMutation({ ssm_id: ssmId }, chartData),
  }));

  return (
    <Loader
      loading={!ssms}
      height={CHART_HEIGHT}
    >
      {ssms && !!ssms.hits.edges.length && (
        <Column>
          <VisualizationHeader
            title={TITLE}
            style={{ width: showSurvivalPlot ? '100%' : '50%' }}
            buttons={[
              <DownloadVisualizationButton
                key="download"
                svg={() => wrapSvg({ selector: '#mutation-chart svg', title: TITLE })}
                data={chartData.map(d => ({ label: d.fullLabel, value: d.value }))}
                slug="most-frequent-mutations-bar-chart"
                noText
                tooltipHTML="Download image or data"
              />,
            ]}
          />
          <Row id="mutation-chart" style={{ padding: '2rem 2rem 0' }}>
            <BarChart
              bandwidth={bandWidth}
              data={chartData}
              margin={CHART_MARGINS}
              height={CHART_HEIGHT}
              yAxis={{ title: '# Affected Cases' }}
              styles={{
                bars: { fill: theme.secondary },
                tooltips: {
                  fill: '#fff',
                  stroke: theme.greyScale4,
                  textFill: theme.greyScale3,
                },
              }}
            />
          </Row>
        </Column>
      )}
    </Loader>
  );
});

export const FrequentMutationsChartQuery = {
  initialVariables: {
    fetchData: false,
    fmChart_filters: null,
    score: 'occurrence.case.project.project_id',
    ssmTested: makeFilter([{
      field: 'cases.available_variation_data',
      value: 'ssm',
    }], false),
    sort: [{ field: '_score', order: 'desc' }, { field: '_uid', order: 'asc' }],
  },
  fragments: {
    explore: () => Relay.QL`
      fragment on Explore {
        d: cases { hits(first: 0) { total }}
        filteredCases: cases @include(if: $fetchData) {
          hits(first: 0 filters: $fmChart_filters) {
            total
          }
        }
        ssms @include(if: $fetchData) {
          hits (first: 20 filters: $fmChart_filters, score: $score, sort: $sort) {
            total
            edges {
              node {
                score
                genomic_dna_change
                ssm_id
              }
            }
          }
        }
      }
    `,
  },
};

const FrequentMutationsChart = Relay.createContainer(
  FrequentMutationsChartComponent,
  FrequentMutationsChartQuery
);

export default FrequentMutationsChart;
