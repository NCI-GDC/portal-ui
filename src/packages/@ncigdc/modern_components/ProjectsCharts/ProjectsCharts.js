/* @flow */
import React from 'react';
import Measure from 'react-measure';
import QuestionIcon from 'react-icons/lib/fa/question-circle';
import * as d3 from 'd3';
import { compose, withState, withProps } from 'recompose';
import JSURL from 'jsurl';
import { sortBy } from 'lodash';
import Column from '@ncigdc/uikit/Flex/Column';
import Row from '@ncigdc/uikit/Flex/Row';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import withRouter from '@ncigdc/utils/withRouter';
import { setFilter, mergeQuery, removeFilter } from '@ncigdc/utils/filters';
import { removeEmptyKeys } from '@ncigdc/utils/uri';
import DoubleRingChart from '@ncigdc/components/Charts/DoubleRingChart';
import StackedBarChart from '@ncigdc/components/Charts/StackedBarChart';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import styled from '@ncigdc/theme/styled';
import { withTheme } from '@ncigdc/theme';
import type { TGroupContent, TGroupFilter } from '@ncigdc/utils/filters/types';

const color = d3.scaleOrdinal([
  ...d3.schemeCategory20,
  '#CE6DBD',
  '#AD494A',
  '#8C6D31',
  '#B5CF6B',
]);

type yAxisUnit = 'percent' | 'number';

type TProps = {
  projectIds: Array<string>,
  caseCountFilters: TGroupContent,
  fmgChartFilters: TGroupFilter,
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
  yAxisUnit?: yAxisUnit,
  setYAxisUnit?: Function,
  projectsViewer: { projects: { hits: { edges: Array<Object> } } },
  theme: Object,
  query: Object,
  pathname: string,
  push: Function,
  viewer: {
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
  },
};

const Container = styled(Row, {
  backgroundColor: 'white',
  border: '1px solid #ddd',
  borderRadius: '4px',
  height: '300px',
});

export default compose(
  withState('yAxisUnit', 'setYAxisUnit', 'percent'),
  withRouter,
  withProps(props => {
    const { aggregations } = JSON.parse(
      props.analysisViewer.analysis.top_cases_count_by_genes.data,
    );

    const caseAggs = aggregations.projects.buckets.filter(b =>
      props.projectIds.includes(b.key),
    );

    const numUniqueCases = props.viewer.explore.cases.hits.total;

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
      props.topGenesSource.reduce(
        (acc, g) => ({ ...acc, [g.gene_id]: {} }),
        {},
      ),
    );

    return {
      numUniqueCases,
      topGenesWithCasesPerProject,
    };
  }),
  withTheme,
)(
  ({
    numUniqueCases,
    topGenesWithCasesPerProject,
    projectsIsFetching,
    genesIsFetching,
    topGenesSource,
    yAxisUnit,
    setYAxisUnit,
    projectsViewer,
    viewer,
    theme,
    query,
    pathname,
    push,
    caseCountFilters,
    fmgChartFilters,
  }: TProps) => {
    const projects = projectsViewer.projects.hits.edges.map(x => x.node);
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
              filters: JSURL.stringify(
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
                <br /> {count.toLocaleString()} Case{count > 1 ? 's' : ''}{' '}
                Affected<br />
                {count.toLocaleString()} / {numUniqueCases.toLocaleString()} ({percent.toFixed(2)}%)
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
        total: yAxisUnit === 'number'
          ? stackedBarCalculations[geneId].countTotal
          : stackedBarCalculations[geneId].countTotal / numUniqueCases * 100,
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
                  stop_lost, initiator_codon_variant, stop_gained{'}'}
                </div>
              }
            >
              <QuestionIcon
                style={{ color: theme.greyScale7, marginLeft: '5px' }}
              />
            </Tooltip>
          </div>
          {[
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
                {({ width }) =>
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
                  </div>}
              </Measure>
            </span>,
          ]}
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
          {[
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
          ]}
        </Column>
      </Container>
    );
  },
);
