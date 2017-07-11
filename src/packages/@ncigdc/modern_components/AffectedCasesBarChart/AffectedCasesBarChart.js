// @flow

import React from 'react';
import Relay from 'react-relay/classic';
import { parse } from 'query-string';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import withRouter from '@ncigdc/utils/withRouter';
import { viewerQuery } from '@ncigdc/routes/queries';
import { handleReadyStateChange } from '@ncigdc/dux/loaders';
import { parseFilterParam } from '@ncigdc/utils/uri';
import { Row, Column } from '@ncigdc/uikit/Flex';
import BarChart from '@ncigdc/components/Charts/BarChart';
import { withTheme } from '@ncigdc/theme';
import { ConnectedLoader } from '@ncigdc/uikit/Loaders/Loader';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import wrapSvg from '@ncigdc/utils/wrapSvg';

const CHART_HEIGHT = 285;
const COMPONENT_NAME = 'AffectedCasesBarChart';

const createRenderer = (Route, Container) =>
  compose(withRouter, connect())((props: mixed) =>
    <div style={{ position: 'relative', minHeight: `${CHART_HEIGHT}px` }}>
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
    </div>,
  );

class Route extends Relay.Route {
  static routeName = COMPONENT_NAME;
  static queries = viewerQuery;
  static prepareParams = ({ location: { search }, defaultFilters = null }) => {
    const q = parse(search);

    return {
      affectedCasesBarChart_filters: parseFilterParam(
        q.affectedCasesBarChart_filters,
        defaultFilters || null,
      ),
    };
  };
}

const createContainer = Component =>
  Relay.createContainer(Component, {
    initialVariables: {
      affectedCasesBarChart_filters: null,
      score: 'gene.gene_id',
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
                    submitter_id
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
  withTheme,
  withRouter,
)(
  ({
    viewer: { explore: { cases = { hits: { edges: [] } } } },
    theme,
    push,
    style,
  }) => {
    const chartData = cases.hits.edges.map(x => x.node).map(c => ({
      fullLabel: c.submitter_id,
      label: c.submitter_id,
      value: c.score,
      tooltip: (
        <span>
          <b>{c.submitter_id}</b><br />
          {c.score.toLocaleString()} Genes Affected
        </span>
      ),
      onClick: () => push(`/cases/${c.case_id}`),
    }));

    return (
      <div style={style}>
        <Column style={{ padding: '0 0 0 2rem' }}>
          {cases &&
            !!cases.hits.edges.length &&
            <Row style={{ justifyContent: 'flex-end' }}>
              <DownloadVisualizationButton
                svg={() =>
                  wrapSvg({
                    selector: '#most-affected-cases svg',
                    title: 'Most Affected Cases',
                  })}
                data={chartData.map(d => ({
                  label: d.fullLabel,
                  value: d.value,
                }))}
                slug="most-affected-cases-bar-chart"
                noText
                tooltipHTML="Download image or data"
                style={{ marginRight: '2rem' }}
              />
            </Row>}
          {cases &&
            !!cases.hits.edges.length &&
            <Row id="most-affected-cases">
              <BarChart
                data={chartData}
                height={CHART_HEIGHT}
                margin={{ top: 20, right: 50, bottom: 85, left: 55 }}
                yAxis={{ title: '# Affected Genes' }}
                styles={{
                  xAxis: {
                    stroke: theme.greyScale4,
                    textFill: theme.greyScale3,
                  },
                  yAxis: {
                    stroke: theme.greyScale4,
                    textFill: theme.greyScale3,
                  },
                  bars: { fill: theme.secondary },
                  tooltips: {
                    fill: '#fff',
                    stroke: theme.greyScale4,
                    textFill: theme.greyScale3,
                  },
                }}
              />
            </Row>}
        </Column>
      </div>
    );
  },
);

export default createRenderer(Route, createContainer(Component));
