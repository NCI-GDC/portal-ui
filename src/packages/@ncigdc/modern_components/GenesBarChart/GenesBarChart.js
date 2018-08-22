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
import wrapSvg from '@ncigdc/utils/wrapSvg';
import VisualizationHeader from '@ncigdc/components/VisualizationHeader';
import { createClassicRenderer } from '@ncigdc/modern_components/Query';

const MUTATED_TITLE = 'Distribution of Most Frequently Mutated Genes';
const CNA_TITLE = 'Distribution of Most Frequently Copy Number Variation Genes';
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
      { key: 'loss2' },
      { key: 'loss1' },
      { key: 'gain1' },
      { key: 'gain2' },
    ];
    /* prettier-ignore */

    const cnaNodes = [
      {
        symbol:'TP53',
        gene_id: 'ENSG00000141510',
        gain2:2000,
        gain1:1500,
        loss1:2200,
        loss2:1700,
      },{  
        symbol: "TTN",
        gene_id: "ENSG00000155657",
        gain2:2000,
        gain1:150,
        loss1:220,
        loss2:170,
      },{  
        symbol: "MUC16",
        gene_id: "ENSG00000181143",
        gain2:200,
        gain1:1500,
        loss1:220,
        loss2:170,
      },{
        symbol: "CSMD3",
        gene_id: "ENSG00000164796",
        gain2:200,
        gain1:150,
        loss1:2200,
        loss2:170,
      },{  
        symbol: "SYNE1",
        gene_id: "ENSG00000131018",
        gain2:200,
        gain1:150,
        loss1:220,
        loss2:1700,
      },{  
        symbol: "RYR2",
        gene_id: "ENSG00000198626",
        gain2:1000,
        gain1:150,
        loss1:220,
        loss2:170,
      },{
        symbol: "LRP1B",
        gene_id: "ENSG00000168702",
        gain2:200,
        gain1:1150,
        loss1:220,
        loss2:170,
      },{  
        symbol: "FLG",
        gene_id: "ENSG00000143631",
        gain2:200,
        gain1:150,
        loss1:220,
        loss2:1170,
      },{  
        symbol: "PIK3CA",
        gene_id: "ENSG00000121879",
        gain2:200,
        gain1:1990,
        loss1:220,
        loss2:170,
      },{  
        symbol: "USH2A",
        gene_id: "ENSG00000042781",
        gain2:200,
        gain1:150,
        loss1:2000,
        loss2:170,
      },{  
        symbol: "PCLO",
        gene_id: "ENSG00000186472",
        gain2:200,
        gain1:150,
        loss1:220,
        loss2:1700,
      },{  
        symbol: "OBSCN",
        gene_id: "ENSG00000154358",
        gain2:200,
        gain1:1500,
        loss1:220,
        loss2:170,
      },{  
        symbol: "MUC4",
        gene_id: "ENSG00000145113",
        gain2:2000,
        gain1:1500,
        loss1:220,
        loss2:170,
      },{  
        symbol: "ZFHX4",
        gene_id: "ENSG00000091656",
        gain2:2000,
        gain1:150,
        loss1:2200,
        loss2:170,
      },{  
        symbol: "DNAH5",
        gene_id: "ENSG00000039139",
        gain2:200,
        gain1:150,
        loss1:220,
        loss2:170,
      },{  
        symbol: "CSMD1",
        gene_id: "ENSG00000183117",
        gain2:200,
        gain1:150,
        loss1:220,
        loss2:170,
      },{  
        symbol: "XIRP2",
        gene_id: "ENSG00000163092",
        gain2:200,
        gain1:150,
        loss1:220,
        loss2:170,
      },{  
        symbol: "DST",
        gene_id: "ENSG00000151914",
        gain2:200,
        gain1:150,
        loss1:220,
        loss2:170,
      },{  
        symbol: "FAT3",
        gene_id: "ENSG00000165323",
        gain2:200,
        gain1:150,
        loss1:220,
        loss2:170,
      },{  
        symbol: "FAT4",
        gene_id: "ENSG00000196159",
        gain2:200,
        gain1:150,
        loss1:220,
        loss2:170,
      }];
    const cnaGenesChartData = cnaNodes
      .sort((a, b) => checkers.reduce((acc, c) => b[c.key] - a[c.key] + acc, 0))
      .map(g => {
        const score = checkers.reduce((acc, c) => g[c.key] + acc, 0);
        return {
          label: g.symbol,
          value:
            context === 'project' && projectId
              ? score / numCasesAggByProject[projectId] * 100
              : score / filteredCases.hits.total * 100,
          tooltip: tooltipContext(context, { symbol: g.symbol, score: score }),
          onClick: () => handleClickGene(g, cnaGenesChartData),
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
              />
            )}
            {!!mutatedGenesChartData.length &&
              showingMore && (
                <div id="cna-genes-chart">
                  <Row style={{ paddingTop: '2rem' }}>
                    <BarChart
                      data={cnaGenesChartData}
                      yAxis={{ title: '% of Cases Affected' }}
                      height={CHART_HEIGHT}
                      colors={checkers.reduce(
                        (acc, f) => ({ ...acc, [f.key]: f.color }),
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
