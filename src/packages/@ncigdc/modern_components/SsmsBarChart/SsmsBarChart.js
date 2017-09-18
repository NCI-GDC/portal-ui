// @flow

import React from 'react';
import Relay from 'react-relay/classic';
import { orderBy } from 'lodash';
import { parse } from 'query-string';
import { compose, withHandlers } from 'recompose';
import { viewerQuery } from '@ncigdc/routes/queries';
import withRouter from '@ncigdc/utils/withRouter';
import { parseFilterParam } from '@ncigdc/utils/uri';
import { makeFilter } from '@ncigdc/utils/filters';
import { withTheme } from '@ncigdc/theme';
import { Row, Column } from '@ncigdc/uikit/Flex';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import BarChart from '@ncigdc/components/Charts/BarChart';
import wrapSvg from '@ncigdc/utils/wrapSvg';
import VisualizationHeader from '@ncigdc/components/VisualizationHeader';
import { createClassicRenderer } from '@ncigdc/modern_components/Query';

const TITLE = 'Distribution of Most Frequent Somatic Mutations';
const CHART_HEIGHT = 285;
const COMPONENT_NAME = 'SsmsBarChart';

class Route extends Relay.Route {
  static routeName = COMPONENT_NAME;
  static queries = viewerQuery;
  static prepareParams = ({ location: { search }, defaultFilters = null }) => {
    const q = parse(search);

    return {
      ssmsBarChart_filters: parseFilterParam(
        q.ssmsBarChart_filters,
        defaultFilters || null,
      ),
    };
  };
}

const createContainer = Component =>
  Relay.createContainer(Component, {
    initialVariables: {
      fetchData: false,
      ssmsBarChart_filters: null,
      score: 'occurrence.case.project.project_id',
      ssmTested: makeFilter([
        {
          field: 'cases.available_variation_data',
          value: 'ssm',
        },
      ]),
      sort: [
        { field: '_score', order: 'desc' },
        { field: '_uid', order: 'asc' },
      ],
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Root {
          explore {
            filteredCases: cases {
              hits(first: 0 filters: $ssmsBarChart_filters) {
                total
              }
            }
            ssms {
              hits (first: 20 filters: $ssmsBarChart_filters, score: $score, sort: $sort) {
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
        }
      `,
    },
  });

const Component = compose(
  withRouter,
  withHandlers({
    handleClickMutation: ({ push, onClickMutation }) => (ssm, chartData) =>
      onClickMutation
        ? onClickMutation(ssm, chartData)
        : push(`/ssms/${ssm.ssm_id}`),
  }),
  withTheme,
)(
  ({
    theme,
    viewer: { explore: { ssms = { hits: { edges: [] } }, filteredCases } },
    context,
    handleClickMutation,
    style,
  }) => {
    // Data has to be sorted because the relay cache does not store the order.
    const chartData = orderBy(
      ssms.hits.edges.map(e => e.node),
      ['score', 'ssm_id'],
      ['desc', 'asc'],
    ).map(({ score = 0, ssm_id: ssmId }) => ({
      fullLabel: ssmId,
      label: `${ssmId.substr(0, 8)}...`,
      value: score,
      tooltip: (
        <span>
          <b>{ssmId}</b>
          <br />
          <div>
            {score.toLocaleString()} Case{score > 1 ? 's' : ''}
            &nbsp;affected in {context}
          </div>
          {!!filteredCases.hits.total && (
            <div>
              <span>{score.toLocaleString()}</span>
              <span> / </span>
              <span>{filteredCases.hits.total.toLocaleString()}</span>
              <span>
                &nbsp;({(score / filteredCases.hits.total * 100).toFixed(2)}%)
              </span>
            </div>
          )}
        </span>
      ),
      onClick: () => handleClickMutation({ ssm_id: ssmId }, chartData),
    }));

    return (
      <div style={style}>
        {ssms &&
          !!ssms.hits.edges.length && (
            <Column style={{ paddingLeft: '2rem' }}>
              <VisualizationHeader
                title={TITLE}
                buttons={[
                  <DownloadVisualizationButton
                    key="download"
                    svg={() =>
                      wrapSvg({
                        selector: '#mutation-chart svg',
                        title: TITLE,
                      })}
                    data={chartData.map(d => ({
                      label: d.fullLabel,
                      value: d.value,
                    }))}
                    slug="most-frequent-mutations-bar-chart"
                    noText
                    tooltipHTML="Download image or data"
                  />,
                ]}
              />
              <Row id="mutation-chart" style={{ paddingTop: '2rem' }}>
                <BarChart
                  data={chartData}
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
      </div>
    );
  },
);

export default createClassicRenderer(
  Route,
  createContainer(Component),
  CHART_HEIGHT,
);
