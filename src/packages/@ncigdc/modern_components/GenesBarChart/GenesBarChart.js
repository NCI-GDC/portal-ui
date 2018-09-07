// @flow
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay/classic';
import { compose, withHandlers } from 'recompose';
import { parse } from 'query-string';

import withRouter from '@ncigdc/utils/withRouter';
import { parseFilterParam, stringifyJSONParam } from '@ncigdc/utils/uri';
import { viewerQuery } from '@ncigdc/routes/queries';
import { makeFilter, removeFilter } from '@ncigdc/utils/filters';
import { withTheme } from '@ncigdc/theme';
import { Row, Column } from '@ncigdc/uikit/Flex';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import BarChart from '@ncigdc/components/Charts/BarChart';
import FilteredStackedBarChart from '@ncigdc/components/Charts/FilteredStackedBarChart';
import wrapSvg from '@ncigdc/utils/wrapSvg';
import VisualizationHeader from '@ncigdc/components/VisualizationHeader';
import { createClassicRenderer } from '@ncigdc/modern_components/Query';

const MUTATED_TITLE = 'Distribution of Most Frequently Mutated Genes';
const CNV_TITLE = 'Most Frequent Genes with CNV';
const CHART_HEIGHT = 285;
const COMPONENT_NAME = 'GenesBarChart';

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
                      hits(first: 0) {
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
    showingMore,
    handleClickGene,
    style,
    push,
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
              <b>{symbol}</b>
              <br />
              {score.toLocaleString()} Case
              {score > 1 ? 's' : ''} affected in {projectId}
              <br />
              {score.toLocaleString()} /{' '}
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
              <b>{symbol}</b>
              <br />
              {score.toLocaleString()} Case
              {score > 1 ? 's' : ''} affected in explore
              <br />
              {score.toLocaleString()} /{' '}
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
        value:
          context === 'project' && projectId
            ? g.score / numCasesAggByProject[projectId] * 100
            : g.score / filteredCases.hits.total * 100,
        tooltip: tooltipContext(context, g),
        onClick: () => handleClickGene(g, mutatedGenesChartData),
      }));
    const checkers = [
      { key: 'loss2', color: '#00457c', name: 'Deep Loss' },
      { key: 'loss1', color: '#0d71e8', name: 'Shallow Loss' },
      { key: 'gain1', color: '#d33737', name: 'Gain' },
      { key: 'gain2', color: '#900000', name: 'Amplification' },
    ];

    const cnvNodes = genes.hits.edges.map(x => ({
      symbol: x.node.symbol,
      gene_id: x.node.gene_id,
      gain2: Math.round(x.node.score / 5),
      gain1: Math.floor(x.node.score / 5),
      loss1: Math.floor(x.node.score / 7),
      loss2: Math.round(x.node.score / 7),
    }));
    const cnvGenesChartData = cnvNodes
      .sort((a, b) => checkers.reduce((acc, c) => b[c.key] - a[c.key] + acc, 0))
      .map(g => {
        return {
          symbol: g.symbol,
          loss2:
            context === 'project' && projectId
              ? g.loss2 / numCasesAggByProject[projectId] * 100
              : g.loss2 / filteredCases.hits.total * 100,
          loss1:
            context === 'project' && projectId
              ? g.loss1 / numCasesAggByProject[projectId] * 100
              : g.loss1 / filteredCases.hits.total * 100,
          gain1:
            context === 'project' && projectId
              ? g.gain1 / numCasesAggByProject[projectId] * 100
              : g.gain1 / filteredCases.hits.total * 100,
          gain2:
            context === 'project' && projectId
              ? g.gain2 / numCasesAggByProject[projectId] * 100
              : g.gain2 / filteredCases.hits.total * 100,
          tooltips: checkers.reduce(
            (acc, checker) => ({
              ...acc,
              [checker.key]: tooltipContext(context, {
                symbol: g.symbol,
                score: g[checker.key],
              }),
            }),
            0,
          ),
          onClick: () => handleClickGene(g, cnvGenesChartData),
        };
      });
    return (
      <div style={style}>
        {!!mutatedGenesChartData && (
          <Column style={{ paddingLeft: '2rem' }}>
            <VisualizationHeader
              title={MUTATED_TITLE}
              buttons={[
                <DownloadVisualizationButton
                  key="download"
                  disabled={!mutatedGenesChartData.length}
                  svg={() =>
                    wrapSvg({
                      selector: '#mutated-genes-chart svg',
                      title: MUTATED_TITLE,
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
            {!!mutatedGenesChartData.length && (
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
              </div>
            )}

            {showingMore && (
              <VisualizationHeader
                title={CNV_TITLE}
                buttons={[
                  <DownloadVisualizationButton
                    key="download"
                    disabled={!cnvGenesChartData.length}
                    svg={() =>
                      wrapSvg({
                        selector: '#cnv-genes-chart svg',
                        title: CNV_TITLE,
                      })}
                    data={cnvGenesChartData.map(d => d)}
                    slug="most-frequently-cnv-genes-bar-chart"
                    tooltipHTML="Download image or data"
                    noText
                  />,
                ]}
              />
            )}
            {!!cnvGenesChartData.length &&
              showingMore && (
                <div id="cnv-genes-chart">
                  <FilteredStackedBarChart
                    data={cnvGenesChartData}
                    yAxis={{ title: '% of Cases Affected' }}
                    colors={checkers.reduce(
                      (acc, f) => ({ ...acc, [f.key]: f.color }),
                      0,
                    )}
                    displayFilters={checkers.reduce(
                      (acc, f) => ({ ...acc, [f.key]: true }),
                      0,
                    )}
                    margin={{ top: 20, right: 50, bottom: 65, left: 55 }}
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
                  <Row style={{ display: 'flex', justifyContent: 'center' }}>
                    {checkers.map(f => (
                      <label key={f.key}>
                        <span
                          style={{
                            color: f.color,
                            backgroundColor: f.color,
                            textAlign: 'center',
                            border: '2px solid',
                            height: '18px',
                            width: '18px',
                            cursor: 'pointer',
                            display: 'inline-block',
                            marginRight: '6px',
                            marginTop: '3px',
                            verticalAlign: 'middle',
                            lineHeight: '16px',
                          }}
                        />
                        {f.name}&nbsp;&nbsp;&nbsp;
                      </label>
                    ))}
                  </Row>
                </div>
              )}
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
