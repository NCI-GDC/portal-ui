/* @flow */
// Vendor
import React from 'react';
import Measure from 'react-measure';
import Relay from 'react-relay/classic';
import QuestionIcon from 'react-icons/lib/fa/question-circle';
import * as d3 from 'd3';
import {
  compose,
  withState,
  withProps,
  lifecycle,
  mapProps,
  withPropsOnChange,
} from 'recompose';
import { isEqual, sortBy } from 'lodash';

// Custom
import Column from '@ncigdc/uikit/Flex/Column';
import Row from '@ncigdc/uikit/Flex/Row';
import SpinnerParticle from '@ncigdc/uikit/Loaders/Particle';
import { Tooltip } from '@ncigdc/uikit/Tooltip';

import withRouter from '@ncigdc/utils/withRouter';
import { fetchApi } from '@ncigdc/utils/ajax';
import { setFilter, mergeQuery, removeFilter } from '@ncigdc/utils/filters';
import { removeEmptyKeys } from '@ncigdc/utils/uri';

import StackedBarChart from '@ncigdc/components/Charts/StackedBarChart';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';

import styled from '@ncigdc/theme/styled';
import { withTheme } from '@ncigdc/theme';
import caseHasMutation from '@ncigdc/utils/filters/prepared/caseHasMutation';
import significantConsequences from '@ncigdc/utils/filters/prepared/significantConsequences';
import { TGroupContent, TGroupFilter } from '@ncigdc/utils/filters/types';
import PieChart from '@ncigdc/components/Charts/PieChart';
import { stringifyJSONParam } from '@ncigdc/utils/uri';

const color = d3.scaleOrdinal([
  ...d3.schemeCategory20,
  '#CE6DBD',
  '#AD494A',
  '#8C6D31',
  '#B5CF6B',
]);

type yAxisUnit = 'percent' | 'number';

type TProps = {
  setState: Function,
  projectIds: Array<string>,
  caseCountFilters: TGroupContent,
  fmgChartFilters: TGroupFilter,
  state: {
    numUniqueCases: number,
    topGenesWithCasesPerProject: {
      [gene_id: string]: { [project_id: string]: number, symbol: string },
    },
    projectsIsFetching: boolean,
    genesIsFetching: boolean,
    topGenesSource: Array<{
      gene_id: string,
      symbol: string,
    }>,
  },
  relay: {
    setVariables: Function,
  },
  yAxisUnit?: yAxisUnit,
  setYAxisUnit?: Function,
  hits: { edges: Array<Object> },
  theme: Object,
  query: Object,
  pathname: string,
  push: Function,
  explore: {
    cases: {
      hits: {
        total: number,
      },
    },
    genes: {
      hits: {
        edges: Array<{
          node: {
            gene_id: string,
            symbol: string,
          },
        }>,
      },
    },
  },
};

const Container = styled(Row, {
  marginBottom: '2rem',
  backgroundColor: 'white',
  border: '1px solid #ddd',
  borderRadius: '4px',
  height: '300px',
});

const initialState = {
  topGenesWithCasesPerProject: {},
  numUniqueCases: 0,
  projectsIsFetching: false,
  genesIsFetching: true,
  topGenesSource: [],
};

function getGenes({ relay, caseCountFilters, fmgChartFilters }: TProps): void {
  relay.setVariables({
    fetchGeneData: true,
    fmgCaseCount_filters: caseCountFilters.length
      ? { op: 'AND', content: caseCountFilters }
      : null,
    fmgChart_filters: fmgChartFilters,
  });
}

const ProjectsChartsComponent = compose(
  withState('state', 'setState', initialState),
  withState('yAxisUnit', 'setYAxisUnit', 'percent'),
  withRouter,
  mapProps(props => ({
    ...props,
    projectIds: props.hits.edges.map(x => x.node.project_id).sort(),
  })),
  withPropsOnChange(['projectIds'], ({ projectIds }) => ({
    fmgChartFilters: {
      op: 'AND',
      content: [
        significantConsequences,
        projectIds.length
          ? {
              op: 'in',
              content: {
                field: 'cases.project.project_id',
                value: projectIds,
              },
            }
          : null,
        {
          op: 'in',
          content: {
            field: 'genes.is_cancer_gene_census',
            value: [true],
          },
        },
      ].filter(Boolean),
    },
    caseCountFilters: [
      caseHasMutation,
      projectIds.length
        ? {
            op: 'in',
            content: {
              field: 'cases.project.project_id',
              value: projectIds,
            },
          }
        : null,
    ].filter(Boolean),
  })),
  withProps({
    async fetchData(props: TProps): Promise<*> {
      const topGenesSource = (props.explore.genes.hits.edges || []).map(
        g => g.node,
      );

      const {
        aggregations,
      } = await fetchApi('analysis/top_cases_counts_by_genes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          size: 0,
          gene_ids: topGenesSource.map(g => g.gene_id).join(),
          filters: JSON.stringify(props.fmgChartFilters),
        },
      });

      const caseAggs = aggregations.projects.buckets.filter(b =>
        props.projectIds.includes(b.key),
      );
      const numUniqueCases = props.explore.cases.hits.total;

      const topGenesWithCasesPerProject = caseAggs.reduce(
        (acc, agg) =>
          agg.genes.my_genes.gene_id.buckets.reduce(
            (genes, gene) => ({
              ...genes,
              [gene.key]: {
                ...genes[gene.key],
                [agg.key]: gene.doc_count,
              },
            }),
            acc,
          ),
        topGenesSource.reduce((acc, g) => ({ ...acc, [g.gene_id]: {} }), {}),
      );

      props.setState(state => ({
        ...state,
        numUniqueCases,
        topGenesWithCasesPerProject,
        genesIsFetching: false,
        topGenesSource,
      }));
    },
  }),
  lifecycle({
    componentDidMount(): void {
      getGenes(this.props);
    },
    componentWillReceiveProps(nextProps: TProps): void {
      if (!isEqual(this.props.projectIds, nextProps.projectIds)) {
        this.props.setState(s => ({ ...s, genesIsFetching: true }));
        getGenes(nextProps);
      } else if (
        nextProps.explore &&
        !isEqual(this.props.explore, nextProps.explore)
      ) {
        this.props.setState(s => ({ ...s, genesIsFetching: true }));
        this.props.fetchData(nextProps);
      }
    },
  }),
  withTheme,
)(
  ({
    state: {
      numUniqueCases,
      topGenesWithCasesPerProject,
      projectsIsFetching,
      genesIsFetching,
      topGenesSource,
    },
    yAxisUnit,
    setYAxisUnit,
    hits,
    theme,
    query,
    pathname,
    push,
    caseCountFilters,
    fmgChartFilters,
  }: TProps) => {
    const projects = hits.edges.map(x => x.node);
    const stackedBarCalculations = topGenesSource.reduce(
      (acc, { gene_id: geneId }) => ({
        ...acc,
        [geneId]: {
          countTotal: Object.keys(topGenesWithCasesPerProject[geneId]).reduce(
            (sum, projectId) =>
              sum + topGenesWithCasesPerProject[geneId][projectId],
            0,
          ),
          byProject: Object.keys(
            topGenesWithCasesPerProject[geneId],
          ).map(projectId => ({
            projectId,
            percent:
              topGenesWithCasesPerProject[geneId][projectId] /
              numUniqueCases *
              100,
            count: topGenesWithCasesPerProject[geneId][projectId],
          })),
        },
      }),
      {},
    );
    const stackedBarData = topGenesSource
      .map(({ gene_id: geneId, symbol }) => ({
        symbol,
        gene_id: geneId,
        onClick: () =>
          push({
            pathname: `/genes/${geneId}`,
            query: {
              filters: stringifyJSONParam(
                removeFilter(f => f.match(/^genes\./), fmgChartFilters),
              ),
            },
          }),
        tooltips: stackedBarCalculations[geneId].byProject.reduce(
          (acc, { projectId, percent, count }) => ({
            ...acc,
            [projectId]: (
              <span>
                <b>
                  {projectId}:{' '}
                  {
                    (projects.find(p => p.project_id === projectId) || {
                      name: '',
                    }).name
                  }
                </b>
                <br /> {count} Case{count > 1 ? 's' : ''} Affected<br />
                {count} / {numUniqueCases} ({percent.toFixed(2)}%)
              </span>
            ),
          }),
          {},
        ),
        ...stackedBarCalculations[geneId].byProject.reduce(
          (acc, { projectId, percent, count }) => ({
            ...acc,
            [projectId]: yAxisUnit === 'number' ? count : percent,
          }),
          {},
        ),
        total:
          yAxisUnit === 'number'
            ? stackedBarCalculations[geneId].countTotal
            : stackedBarCalculations[geneId].countTotal / numUniqueCases * 100,
      }))
      .sort((a, b) => b.total - a.total); // relay score sorting isn't returned in reliable order
    const pieChartData = projects.map(project => {
      const count = project.summary.case_count;
      return {
        id: project.project_id,
        count,
        clickHandler: () => {
          const newQuery = mergeQuery(
            {
              filters: setFilter({
                field: 'projects.project_id',
                value: [].concat(project.project_id || []),
              }),
            },
            query,
            'toggle',
          );

          const q = removeEmptyKeys({
            ...newQuery,
            filters: newQuery.filters && stringifyJSONParam(newQuery.filters),
          });

          push({ pathname, query: q });
        },
        tooltip: (
          <span>
            <b>
              {project.project_id}: {project.name}
            </b>
            <br />
            {count.toLocaleString()} case{count > 1 ? 's' : ''}
          </span>
        ),
      };
    });

    const totalCases = projects.reduce(
      (sum, p) => sum + p.summary.case_count,
      0,
    );

    const projectsInTopGenes = Object.keys(topGenesWithCasesPerProject).reduce(
      (acc, g) => [...acc, ...Object.keys(topGenesWithCasesPerProject[g])],
      [],
    );

    const primarySiteProjects = sortBy(projects, [
      p => projectsInTopGenes.includes(p),
      p => p.project_id,
    ]).reduce(
      (acc, p, i) => ({
        ...acc,
        [p.primary_site]: {
          color: acc[p.primary_site] ? acc[p.primary_site].color : color(i),
          projects: [
            ...(acc[p.primary_site] || { projects: [] }).projects,
            p.project_id,
          ],
        },
      }),
      {},
    );

    // brighten project colors by a multiplier that's based on projects number, so the slices don't get too light
    // and if there's only two slices the colors are different enough
    const primarySiteToColor = Object.keys(primarySiteProjects).reduce(
      (primarySiteAcc, primarySite) => ({
        ...primarySiteAcc,
        [primarySite]: {
          ...primarySiteProjects[primarySite],
          projects: primarySiteProjects[primarySite].projects.reduce(
            (acc, projectId, i) => ({
              ...acc,
              [projectId]: d3
                .color(primarySiteProjects[primarySite].color)
                .darker(
                  1 / primarySiteProjects[primarySite].projects.length * i,
                ),
            }),
            {},
          ),
        },
      }),
      {},
    );

    return (
      <Container className="test-projects-charts">
        <Column
          style={{
            paddingRight: '10px',
            minWidth: '550px',
            flexGrow: '2',
          }}
        >
          <div
            style={{
              alignSelf: 'center',
              color: theme.greyScale7,
              padding: '1.5rem 0 0.5rem',
              fontWeight: 'bold',
            }}
          >
            Top Mutated Cancer Genes in Selected Projects
            <Tooltip
              Component={
                <div style={{ maxWidth: '24em' }}>
                  From COSMIC Cancer Gene Census and mutation consequence types
                  in {'{'}missense_variant, frameshift_variant, start_lost,
                  stop_lost, stop_gained{'}'}
                </div>
              }
            >
              <QuestionIcon
                style={{ color: theme.greyScale7, marginLeft: '5px' }}
              />
            </Tooltip>
          </div>
          {!genesIsFetching ? (
            [
              <div
                style={{
                  alignSelf: 'center',
                  color: theme.greyScale7,
                  fontSize: '1.2rem',
                }}
                key="bar-subtitle"
              >
                <ExploreLink
                  query={{
                    searchTableTab: 'cases',
                    filters: caseCountFilters
                      ? { op: 'and', content: caseCountFilters }
                      : null,
                  }}
                >
                  {numUniqueCases.toLocaleString()}
                </ExploreLink>
                {` Unique Case${!numUniqueCases || numUniqueCases > 1
                  ? 's'
                  : ''} with Somatic Mutation Data`}
              </div>,
              <span
                key="bar-wrapper"
                style={{ paddingLeft: '10px', paddingRight: '10px' }}
              >
                <form name="y-axis-unit-toggle" key="y-axis-unit-toggle">
                  <label
                    htmlFor="percentage-cases-radio"
                    style={{
                      paddingRight: '10px',
                      color: theme.greyScale7,
                      fontSize: '1.2rem',
                    }}
                  >
                    <input
                      type="radio"
                      value="days"
                      onChange={() => setYAxisUnit('percent')}
                      checked={yAxisUnit === 'percent'}
                      id="percentage-cases-radio"
                      style={{ marginRight: '5px' }}
                    />
                    % of Cases Affected
                  </label>
                  <label
                    htmlFor="number-cases-radio"
                    style={{
                      paddingRight: '10px',
                      color: theme.greyScale7,
                      fontSize: '1.2rem',
                    }}
                  >
                    <input
                      type="radio"
                      value="years"
                      onChange={() => setYAxisUnit('number')}
                      checked={yAxisUnit === 'number'}
                      id="number-cases-radio"
                      style={{ marginRight: '5px' }}
                    />
                    # of Cases Affected
                  </label>
                </form>
                <Measure key="bar-chart">
                  {({ width }) => (
                    <div style={{ transform: 'scale(0.9)' }}>
                      <StackedBarChart
                        width={width}
                        height={170}
                        data={stackedBarData}
                        projectsIdtoName={projects.reduce(
                          (acc, p) => ({ ...acc, [p.project_id]: p.name }),
                          {},
                        )}
                        colors={Object.keys(primarySiteToColor).reduce(
                          (acc, pSite) => ({
                            ...acc,
                            ...primarySiteToColor[pSite].projects,
                          }),
                          {},
                        )}
                        yAxis={{ title: 'Cases Affected' }}
                        styles={{
                          xAxis: {
                            stroke: theme.greyScale4,
                            textFill: theme.greyScale3,
                          },
                          yAxis: {
                            stroke: theme.greyScale4,
                            textFill: theme.greyScale3,
                          },
                        }}
                      />
                    </div>
                  )}
                </Measure>
              </span>,
            ]
          ) : (
            <Row
              style={{
                justifyContent: 'center',
                paddingTop: '2em',
                paddingBottom: '2em',
              }}
            >
              <SpinnerParticle />
            </Row>
          )}
        </Column>
        <Column
          style={{ minWidth: '200px', flexGrow: '1', flexBasis: '33%' }}
          className="test-case-distribution-per-project"
        >
          <div
            style={{
              alignSelf: 'center',
              color: theme.greyScale7,
              padding: '1.5rem 0 0.5rem',
              fontWeight: 'bold',
            }}
          >
            Case Distribution per Project
          </div>
          {!projectsIsFetching ? (
            [
              <div
                style={{
                  alignSelf: 'center',
                  fontSize: '1.2rem',
                  marginBottom: '2rem',
                }}
                key="pie-subtitle"
              >
                <ExploreLink
                  query={{
                    searchTableTab: 'cases',
                    filters: projects.length
                      ? {
                          op: 'and',
                          content: [
                            {
                              op: 'in',
                              content: {
                                field: 'cases.project.project_id',
                                value: projects.map(x => x.project_id),
                              },
                            },
                          ],
                        }
                      : null,
                  }}
                >
                  {totalCases.toLocaleString()}
                </ExploreLink>
                {` Case${totalCases === 0 || totalCases > 1 ? 's' : ''}
              across ${projects.length.toLocaleString()} Project${projects.length ===
                  0 || projects.length > 1
                  ? 's'
                  : ''}`}
              </div>,
              <PieChart
                key="pie-chart"
                path="count"
                data={pieChartData}
                height={150}
                width={150}
                marginTop={25}
              />,
            ]
          ) : (
            <Row
              style={{
                justifyContent: 'center',
                paddingTop: '2em',
                paddingBottom: '2em',
              }}
            >
              <SpinnerParticle />
            </Row>
          )}
        </Column>
      </Container>
    );
  },
);

export const ProjectsChartsQuery = {
  initialVariables: {
    fetchGeneData: false,
    fmgCaseCount_filters: null,
    fmgChart_filters: null,
    score: 'case.project.project_id',
  },
  fragments: {
    explore: () => Relay.QL`
      fragment on Explore {
        cases { hits(first: 0 filters: $fmgCaseCount_filters) { total } }
        genes {
          h: hits {
            total
          }
        }
        genes @include(if: $fetchGeneData) {
          hits (first: 20 filters: $fmgChart_filters, score: $score) {
            total
            edges {
              node {
                score
                symbol
                gene_id
                filteredCases: case {
                  hits(first: 1 filters: $fmgChart_filters) {
                    total
                  }
                }
                allCases: case {
                  hits(first: 1) {
                    total
                  }
                }
              }
            }
          }
        }
      }
    `,
    hits: () => Relay.QL`
      fragment on ProjectConnection {
        total
        edges @relay(plural: true) {
          node {
            id
            project_id
            name
            disease_type
            program {
              name
            }
            primary_site
            summary {
              case_count
              data_categories {
                case_count
                data_category
              }
              file_count
            }
          }
        }
      }
    `,
  },
};

const ProjectsCharts = Relay.createContainer(
  ProjectsChartsComponent,
  ProjectsChartsQuery,
);

export default ProjectsCharts;
