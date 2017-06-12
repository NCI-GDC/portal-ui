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
import JSURL from 'jsurl';
import { isEqual, sortBy } from 'lodash';

// Custom
import Column from '@ncigdc/uikit/Flex/Column';
import Row from '@ncigdc/uikit/Flex/Row';
import SpinnerParticle from '@ncigdc/uikit/Loaders/Particle';
import { Tooltip } from '@ncigdc/uikit/Tooltip';

import withRouter from '@ncigdc/utils/withRouter';
import { fetchApi } from '@ncigdc/utils/ajax';
import { setFilter, mergeQuery } from '@ncigdc/utils/filters';
import { removeEmptyKeys } from '@ncigdc/utils/uri';

import DoubleRingChart from '@ncigdc/components/Charts/DoubleRingChart';
import StackedBarChart from '@ncigdc/components/Charts/StackedBarChart';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';

import styled from '@ncigdc/theme/styled';
import { withTheme } from '@ncigdc/theme';
import caseHasMutation from '@ncigdc/utils/filters/prepared/caseHasMutation';
import significantConsequences from '@ncigdc/utils/filters/prepared/significantConsequences';
import type { TGroupContent, TGroupFilter } from '@ncigdc/utils/filters/types';

const color = d3.scaleOrdinal([
  ...d3.schemeCategory20,
  '#CE6DBD',
  '#AD494A',
  '#8C6D31',
  '#B5CF6B',
]);

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
      const topGenesSource = (props.explore.genes.hits.edges || [])
        .map(g => g.node);

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
    hits,
    theme,
    query,
    pathname,
    push,
    caseCountFilters,
    fmgChartFilters,
  }: TProps) => {
    const projects = hits.edges.map(x => x.node);
    const stackedBarData = topGenesSource
      .map(({ gene_id: geneId, symbol }) => ({
        symbol,
        gene_id: geneId,
        onClick: () =>
          push({
            pathname: `/genes/${geneId}`,
            query: { filters: JSURL.stringify(fmgChartFilters) },
          }),
        ...topGenesWithCasesPerProject[geneId],
        total: Object.keys(topGenesWithCasesPerProject[geneId])
          .filter(k => k !== 'symbol')
          .reduce(
            (sum, projectId) =>
              sum + topGenesWithCasesPerProject[geneId][projectId],
            0,
          ),
      }))
      .sort((a, b) => b.total - a.total); // relay score sorting isn't returned in reliable order

    const doubleRingData = projects.reduce((acc, p) => {
      const primarySiteCasesCount = acc[p.primary_site]
        ? acc[p.primary_site].value + p.summary.case_count
        : p.summary.case_count;

      return {
        ...acc,
        [p.primary_site]: {
          value: primarySiteCasesCount,
          tooltip: (
            <span>
              <b>{p.primary_site}</b><br />
              {primarySiteCasesCount.toLocaleString()}
              {' '}
              case
              {primarySiteCasesCount > 1 ? 's' : ''}
            </span>
          ),
          clickHandler: () => {
            const newQuery = mergeQuery(
              {
                filters: setFilter({
                  field: 'projects.primary_site',
                  value: [].concat(p.primary_site || []),
                }),
              },
              query,
              'toggle',
            );

            const q = removeEmptyKeys({
              ...newQuery,
              filters: newQuery.filters && JSURL.stringify(newQuery.filters),
            });

            push({ pathname, query: q });
          },
          outer: [
            ...(acc[p.primary_site] || { outer: [] }).outer,
            {
              key: p.project_id,
              value: p.summary.case_count,
              tooltip: (
                <span>
                  <b>{p.name}</b><br />
                  {p.summary.case_count.toLocaleString()}
                  {' '}
                  case
                  {p.summary.case_count > 1 ? 's' : ''}
                </span>
              ),
              clickHandler: () => {
                const newQuery = mergeQuery(
                  {
                    filters: setFilter({
                      field: 'projects.project_id',
                      value: [].concat(p.project_id || []),
                    }),
                  },
                  query,
                  'toggle',
                );

                const q = removeEmptyKeys({
                  ...newQuery,
                  filters:
                    newQuery.filters && JSURL.stringify(newQuery.filters),
                });

                push({ pathname, query: q });
              },
            },
          ],
        },
      };
    }, {});

    const totalCases = projects.reduce(
      (sum, p) => sum + p.summary.case_count,
      0,
    );

    // there are 24 primary sites
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
                .brighter(
                  0.5 *
                    (1 / primarySiteProjects[primarySite].projects.length * i),
                ),
            }),
            {},
          ),
        },
      }),
      {},
    );

    return (
      <Container>
        <Column
          style={{
            paddingRight: '10px',
            minWidth: '550px',
            flexGrow: '2',
            flexBasis: '66%',
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
            <Tooltip Component={<span>From COSMIC Cancer Gene Census</span>}>
              <QuestionIcon
                style={{ color: theme.greyScale7, marginLeft: '5px' }}
              />
            </Tooltip>
          </div>
          {!genesIsFetching
            ? [
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
                <span style={{ transform: 'scale(0.9)' }} key="bar-wrapper">
                  <Measure key="bar-chart">
                    {({ width }) =>
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
                      />}
                  </Measure>
                </span>,
              ]
            : <Row
                style={{
                  justifyContent: 'center',
                  paddingTop: '2em',
                  paddingBottom: '2em',
                }}
              >
                <SpinnerParticle />
              </Row>}
        </Column>
        <Column style={{ minWidth: '200px', flexGrow: '1', flexBasis: '33%' }}>
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
          {!projectsIsFetching
            ? [
                <div
                  style={{
                    alignSelf: 'center',
                    fontSize: '1.2rem',
                    marginBottom: '2rem',
                  }}
                  key="pie-subtitle"
                >
                  {`${totalCases.toLocaleString()} Case${totalCases === 0 ||
                    totalCases > 1
                    ? 's'
                    : ''}
              across ${projects.length.toLocaleString()} Project${projects.length ===
                    0 || projects.length > 1
                    ? 's'
                    : ''}`}
                </div>,
                <span style={{ transform: 'scale(0.75)' }} key="circle-wrapper">
                  <DoubleRingChart
                    key="pie-chart"
                    colors={primarySiteToColor}
                    data={Object.keys(doubleRingData).map(primarySite => ({
                      key: primarySite,
                      ...doubleRingData[primarySite],
                    }))}
                    height={200}
                    width={200}
                  />
                </span>,
              ]
            : <Row
                style={{
                  justifyContent: 'center',
                  paddingTop: '2em',
                  paddingBottom: '2em',
                }}
              >
                <SpinnerParticle />
              </Row>}
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
