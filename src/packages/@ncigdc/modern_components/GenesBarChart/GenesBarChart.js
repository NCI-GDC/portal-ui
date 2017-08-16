// @flow
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay/classic';
import { compose, withHandlers } from 'recompose';
import { parse } from 'query-string';
import { connect } from 'react-redux';

import { handleReadyStateChange } from '@ncigdc/dux/loaders';
import withRouter from '@ncigdc/utils/withRouter';
import { parseFilterParam, stringifyJSONParam } from '@ncigdc/utils/uri';
import { viewerQuery } from '@ncigdc/routes/queries';
import { makeFilter, removeFilter } from '@ncigdc/utils/filters';
import { ConnectedLoader } from '@ncigdc/uikit/Loaders/Loader';
import { withTheme } from '@ncigdc/theme';
import { Row, Column } from '@ncigdc/uikit/Flex';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import BarChart from '@ncigdc/components/Charts/BarChart';
import wrapSvg from '@ncigdc/utils/wrapSvg';
import VisualizationHeader from '@ncigdc/components/VisualizationHeader';

const TITLE = 'Distribution of Most Frequently Mutated Genes';
const CHART_HEIGHT = 285;
const COMPONENT_NAME = 'GenesBarChart';

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
      genesBarChart_filters: parseFilterParam(
        q.genesBarChart_filters,
        defaultFilters || null,
      ),
    };
  };
}

const createContainer = Component =>
  Relay.createContainer(Component, {
    initialVariables: {
      genesBarChart_filters: null,
      score: 'case.project.project_id',
      ssmTested: makeFilter([
        {
          field: 'cases.available_variation_data',
          value: 'ssm',
        },
      ]),
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
      `,
    },
  });

const Component = compose(
  withRouter,
  withHandlers({
    handleClickGene: ({ push, onClickGene, defaultFilters }) => (
      gene,
      chartData,
    ) =>
      onClickGene
        ? onClickGene(gene, chartData)
        : push({
            pathname: `/genes/${gene.gene_id}`,
            query: {
              filters: stringifyJSONParam(
                removeFilter(f => f.match(/^genes\./), defaultFilters),
              ),
            },
          }),
  }),
  withTheme,
)(
  ({
    projectId = '',
    theme,
    viewer: {
      explore: { genes = { hits: { edges: [] } }, cases, filteredCases },
    },
    context = 'explore',
    handleClickGene,
    style,
  }) => {
    const numCasesAggByProject = cases.aggregations.project__project_id.buckets.reduce(
      (acc, b) => ({
        ...acc,
        [b.key]: b.doc_count,
      }),
      {},
    );

    const tooltipContext = (ctx, { symbol, score = 0 }) => {
      switch (ctx) {
        case 'project': {
          return (
            <span>
              <b>{symbol}</b><br />
              {score.toLocaleString()}
              {' '}
              Case
              {score > 1 ? 's' : ''}
              {' '}
              affected in
              {' '}
              {projectId}
              <br />
              {score.toLocaleString()}
              {' '}
              /
              {' '}
              {(numCasesAggByProject[projectId] || 0).toLocaleString()}
              &nbsp;(
              {(score / numCasesAggByProject[projectId] * 100).toFixed(2)}
              %)
            </span>
          );
        }
        case 'explore': {
          return (
            <span>
              <b>{symbol}</b><br />
              {score.toLocaleString()}
              {' '}
              Case
              {score > 1 ? 's' : ''}
              {' '}
              affected in explore
              <br />
              {score.toLocaleString()}
              {' '}
              /
              {' '}
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
    const mutatedGenesChartData = geneNodes
      .sort((a, b) => b.score - a.score)
      .map(g => ({
        label: g.symbol,
        value: context === 'project' && projectId
          ? g.score / numCasesAggByProject[projectId] * 100
          : g.score / filteredCases.hits.total * 100,
        tooltip: tooltipContext(context, g),
        onClick: () => handleClickGene(g, mutatedGenesChartData),
      }));

    return (
      <div style={style}>
        {!!mutatedGenesChartData &&
          <Column style={{ paddingLeft: '2rem' }}>
            <VisualizationHeader
              title={TITLE}
              buttons={[
                <DownloadVisualizationButton
                  key="download"
                  disabled={!mutatedGenesChartData.length}
                  svg={() =>
                    wrapSvg({
                      selector: '#mutated-genes-chart svg',
                      title: TITLE,
                    })}
                  data={mutatedGenesChartData.map(d => ({
                    label: d.label,
                    value: d.value,
                  }))}
                  slug="most-frequently-mutated-genes-bar-chart"
                  tooltipHTML="Download image or data"
                  noText
                />,
              ]}
            />
            {!!mutatedGenesChartData.length &&
              <div id="mutated-genes-chart">
                <Row style={{ paddingTop: '2rem' }}>
                  <BarChart
                    data={mutatedGenesChartData}
                    yAxis={{ title: '% of Cases Affected' }}
                    height={CHART_HEIGHT}
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
                </Row>
              </div>}
          </Column>}
      </div>
    );
  },
);

export default createRenderer(Route, createContainer(Component));
