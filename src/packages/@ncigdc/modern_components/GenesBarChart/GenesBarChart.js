// @flow
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay/classic';
import { compose, withHandlers } from 'recompose';
import { parse } from 'query-string';

import withRouter from '@ncigdc/utils/withRouter';
import { parseFilterParam, stringifyJSONParam } from '@ncigdc/utils/uri';
import { viewerQueryCA } from '@ncigdc/routes/queries';
import { makeFilter, removeFilter } from '@ncigdc/utils/filters';
import { withTheme } from '@ncigdc/theme';
import { Row, Column } from '@ncigdc/uikit/Flex';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import BarChart from '@ncigdc/components/Charts/BarChart';
import FilteredStackedBarChart from '@ncigdc/components/Charts/FilteredStackedBarChart';
import wrapSvg from '@ncigdc/utils/wrapSvg';
import VisualizationHeader from '@ncigdc/components/VisualizationHeader';
import { createClassicRenderer } from '@ncigdc/modern_components/Query';
import { cnvColors } from '@ncigdc/utils/filters/prepared/significantConsequences';
import { renderToString } from 'react-dom/server';

const MUTATED_TITLE = 'Distribution of Most Frequently Mutated Genes';
const CNV_TITLE = 'Most Frequent Genes with CNV';
const CHART_HEIGHT = 285;
const COMPONENT_NAME = 'GenesBarChart';

class Route extends Relay.Route {
  static routeName = COMPONENT_NAME;

  static queries = viewerQueryCA;

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

const createContainer = Component => Relay.createContainer(Component, {
  initialVariables: {
    genesBarChart_filters: null,
    score: 'case.project.project_id',
    ssmTested: makeFilter([
      {
        field: 'cases.available_variation_data',
        value: 'ssm',
      },
    ]),
    // amplificationFilters: makeFilter([
    //   {
    //     field: 'cnvs.cnv_change',
    //     value: 'Amplification',
    //   },
    //   {
    //     field: 'cases.available_variation_data',
    //     value: 'cnv',
    //   },
    // ]),
    gainFilters: makeFilter([
      {
        field: 'cnvs.cnv_change',
        value: 'Gain',
      },
      {
        field: 'cases.available_variation_data',
        value: 'cnv',
      },
    ]),
    lossFilters: makeFilter([
      {
        field: 'cnvs.cnv_change',
        value: 'Loss',
      },
      {
        field: 'cases.available_variation_data',
        value: 'cnv',
      },
    ]),
    // deepLossFilters: makeFilter([
    //   {
    //     field: 'cnvs.cnv_change',
    //     value: 'Deep Loss',
    //   },
    //   {
    //     field: 'cases.available_variation_data',
    //     value: 'cnv',
    //   },
    // ]),
  },
  fragments: {
    viewerWithCA: () => Relay.QL`
        fragment RequiresStudy on Root {
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
                    case_with_cnv_gain_count: case {
                      hits(first: 0, filters: $gainFilters) {
                        total
                      }
                    }
                    case_with_cnv_loss_count: case {
                      hits(first: 0, filters: $lossFilters) {
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
    ) => (onClickGene
      ? onClickGene(gene, chartData)
      : push({
        pathname: `/genes/${gene.gene_id}`,
        query: {
          filters: stringifyJSONParam(
            removeFilter(f => f.match(/^genes\./), defaultFilters),
          ),
        },
      })),
  }),
  withTheme,
)(
  ({
    projectId = '',
    theme,
    viewerWithCA: {
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
              <b>{symbol}</b>
              <br />
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
              &nbsp;(
              {(score / filteredCases.hits.total * 100).toFixed(2)}
              %)
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

    const cnvNodes = genes.hits.edges.map(x => ({
      symbol: x.node.symbol,
      gene_id: x.node.gene_id,
      // amplification: x.node.case_with_cnv_amplification_count.hits.total,
      gain: x.node.case_with_cnv_gain_count.hits.total,
      loss: x.node.case_with_cnv_loss_count.hits.total,
      // deep_loss: x.node.case_with_cnv_deep_loss_count.hits.total,
    }));
    const totalNum =
      context === 'project' && projectId
        ? numCasesAggByProject[projectId]
        : filteredCases.hits.total;
    const cnvGenesChartData = cnvNodes
      .sort((a, b) => cnvColors.reduce((acc, c) => b[c.key] - a[c.key] + acc, 0))
      .map(g => {
        return {
          symbol: g.symbol,
          // deep_loss: g.deep_loss / totalNum * 100,
          loss: g.loss / totalNum * 100,
          gain: g.gain / totalNum * 100,
          // amplification: g.amplification / totalNum * 100,
          tooltips: cnvColors.reduce(
            (acc, color) => ({
              ...acc,
              [color.key]: tooltipContext(context, {
                symbol: g.symbol,
                score: g[color.key],
              }),
            }),
            0,
          ),
          onClick: () => handleClickGene(g, cnvGenesChartData),
        };
      });
    const Legends = () => (
      <Row style={{
        display: 'flex',
        justifyContent: 'center',
      }}
           >
        {cnvColors.map(f => (
          <span
            key={f.key}
            style={{
              paddingRight: '10px',
              display: 'inline-block,',
            }}
            >
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
            {f.name}
          </span>
        ))}
      </Row>
    );
    return (
      <div style={style}>
        {!!mutatedGenesChartData && (
          <Column style={{ paddingLeft: '2rem' }}>
            <VisualizationHeader
              buttons={[
                <DownloadVisualizationButton
                  data={mutatedGenesChartData.map(d => ({
                    label: d.label,
                    value: d.value,
                  }))}
                  disabled={!mutatedGenesChartData.length}
                  key="download"
                  noText
                  slug="most-frequently-mutated-genes-bar-chart"
                  svg={() => wrapSvg({
                    selector: '#mutated-genes-chart svg',
                    title: MUTATED_TITLE,
                  })}
                  tooltipHTML="Download image or data"
                  />,
              ]}
              title={MUTATED_TITLE}
              />
            {!!mutatedGenesChartData.length && (
              <div id="mutated-genes-chart">
                <Row style={{ paddingTop: '2rem' }}>
                  <BarChart
                    data={mutatedGenesChartData}
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
                    yAxis={{ title: '% of Cases Affected' }}
                    />
                </Row>
              </div>
            )}

            {showingMore && (
              <VisualizationHeader
                buttons={[
                  <DownloadVisualizationButton
                    data={cnvGenesChartData.map(d => ({
                      symbol: d.symbol,
                      // amplification: d.amplification,
                      gain: d.gain,
                      loss: d.loss,
                      // deep_loss: d.deep_loss,
                      total: d.total,
                    }))}
                    disabled={!cnvGenesChartData.length}
                    key="download"
                    noText
                    slug="most-frequently-cnv-genes-bar-chart"
                    svg={() => wrapSvg({
                      selector: '#cnv-genes-chart svg',
                      title: CNV_TITLE,
                      legends: renderToString(<Legends />),
                    })}
                    tooltipHTML="Download image or data"
                    />,
                ]}
                title={CNV_TITLE}
                />
            )}
            {!!cnvGenesChartData.length &&
              showingMore && (
                <div id="cnv-genes-chart">
                  <FilteredStackedBarChart
                    colors={cnvColors.reduce(
                      (acc, f) => ({
                        ...acc,
                        [f.key]: f.color,
                      }),
                      0,
                    )}
                    data={cnvGenesChartData}
                    displayFilters={cnvColors.reduce(
                      (acc, f) => ({
                        ...acc,
                        [f.key]: true,
                      }),
                      0,
                    )}
                    margin={{
                      top: 20,
                      right: 50,
                      bottom: 65,
                      left: 55,
                    }}
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
                    yAxis={{ title: '% of Cases Affected' }}
                    />
                  <Legends />
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
