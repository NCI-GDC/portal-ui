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
const CNA_TITLE = 'Distribution of Most Frequently Mutated Genes';
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
        { key: 'loss2', color: '#00457c' },
        { key: 'loss1', color: '#0d71e8' },
        { key: 'gain1', color: '#d33737' },
        { key: 'gain2', color: '#900000' },
      ];
      const cnaNodes = [{  
          symbol:"TP53",
          gain2:2000,
          gain1:1500,
          loss1:2200,
          loss2:1700,
        },{  
          symbol:"TTN",
          gain2:200,
          gain1:150,
          loss1:220,
          loss2:170,
        },{  
          symbol:"MUC16",
          gain2:200,
          gain1:150,
          loss1:220,
          loss2:170,
        },{
          symbol:"CSMD3",
          gain2:200,
          gain1:150,
          loss1:220,
          loss2:170,
        },{  
          symbol:"SYNE1",
          gain2:200,
          gain1:150,
          loss1:220,
          loss2:170,
        },{  
          symbol:"RYR2",
          gain2:200,
          gain1:150,
          loss1:220,
          loss2:170,
        },{
          symbol:"LRP1B",
          gain2:200,
          gain1:150,
          loss1:220,
          loss2:170,
        },{  
          symbol:"FLG",
          gain2:200,
          gain1:150,
          loss1:220,
          loss2:170,
        },{  
          symbol:"PIK3CA",
          gain2:200,
          gain1:150,
          loss1:220,
          loss2:170,
        },{  
          symbol:"USH2A",
          gain2:200,
          gain1:150,
          loss1:220,
          loss2:170,
        },{  
          symbol:"PCLO",
          gain2:200,
          gain1:150,
          loss1:220,
          loss2:170,
        },{  
          symbol:"OBSCN",
          gain2:200,
          gain1:150,
          loss1:220,
          loss2:170,
        },{  
          symbol:"MUC4",
          gain2:200,
          gain1:150,
          loss1:220,
          loss2:170,
        },{  
          symbol:"ZFHX4",
          gain2:200,
          gain1:150,
          loss1:220,
          loss2:170,
        },{  
          symbol:"DNAH5",
          gain2:200,
          gain1:150,
          loss1:220,
          loss2:170,
        },{  
          symbol:"CSMD1",
          gain2:200,
          gain1:150,
          loss1:220,
          loss2:170,
        },{  
          symbol:"XIRP2",
          gain2:200,
          gain1:150,
          loss1:220,
          loss2:170,
        },{  
          symbol:"DST",
          gain2:200,
          gain1:150,
          loss1:220,
          loss2:170,
        },{  
          symbol:"FAT3",
          gain2:200,
          gain1:150,
          loss1:220,
          loss2:170,
        },{  
          symbol:"FAT4",
          gain2:200,
          gain1:150,
          loss1:220,
          loss2:170,
        }]
      const cnaGenesChartData = cnaNodes
        .sort((a, b) => checkers.reduce((acc, c) => b[c.key] - a[c.key] + acc, 0))
        .map(g => ({
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
          tooltips: checkers.reduce((acc, checker) => ({...acc, [checker.key]: tooltipContext(context, { symbol: g.symbol, score: g[checker.key] })}),0),
          onClick: () => handleClickGene(g, cnaGenesChartData),
        }));
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
                    tooltips:{
                        fill: '#fff',
                        stroke: theme.greyScale4,
                        textFill: theme.greyScale3,
                      },
                    }}
                  />
                </Row>
              </div>
            )}

            {showingMore && (<VisualizationHeader
              title={CNA_TITLE}
              buttons={[
                <DownloadVisualizationButton
                  key="download"
                  disabled={!cnaGenesChartData.length}
                  svg={() =>
                    wrapSvg({
                      selector: '#cna-genes-chart svg',
                      title: CNA_TITLE,
                    })}
                  data={cnaGenesChartData.map(d => d)}
                  slug="most-frequently-cna-genes-bar-chart"
                  tooltipHTML="Download image or data"
                  noText
                />,
              ]}
            />)}
            {!!mutatedGenesChartData.length && showingMore && (
              <div id="cna-genes-chart">
                <Row style={{ paddingTop: '2rem' }}>
                  <FilteredStackedBarChart
                    data={cnaGenesChartData}
                    yAxis={{ title: '% of Cases Affected' }}
                    height={CHART_HEIGHT}
                    colors={checkers.reduce(
                      (acc, f) => ({ ...acc, [f.key]: f.color }),
                      0,
                    )}
                    displayFilters={checkers.reduce(
                      (acc, f) => ({ ...acc, [f.key]: true }),
                      0,
                    )}
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
                    tooltips:{
                        fill: '#fff',
                        stroke: theme.greyScale4,
                        textFill: theme.greyScale3,
                      },
                    }}
                  />
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
