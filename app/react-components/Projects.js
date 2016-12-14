/* @flow */
// Vendor
import React from 'react';
import Measure from 'react-measure';
import * as d3 from 'd3';

// Custom
import Column from './uikit/Flex/Column';
import Row from './uikit/Flex/Row';
import DoubleRingChart from './charts/DoubleRingChart';
import StackedBarChart from './charts/StackedBarChart';
import theme from './theme';
import SpinnerParticle from './uikit/SpinnerParticle';

const Projects = ({
  projects = [],
  topGenesWithCasesPerProject = {},
  FacetService,
  projectsIsFetching,
  genesIsFetching,
  numUniqueCases,
}: {
    projects: Array<Object>,
    topGenesWithCasesPerProject: { [gene_id: string]: { [project_id: string]: number, symbol: string}},
    numUniqueCases: number,
    FacetService: any,
    projectsIsFetching: boolean,
    genesIsFetching: boolean,
  }) => {
  const stackedBarData = Object.keys(topGenesWithCasesPerProject).map(geneId => ({
    symbol: topGenesWithCasesPerProject[geneId].symbol,
    gene_id: geneId,
    ...topGenesWithCasesPerProject[geneId],
    total: Object.keys(topGenesWithCasesPerProject[geneId])
      .filter(k => k !== 'symbol')
      .reduce((sum, projectId) => sum + topGenesWithCasesPerProject[geneId][projectId], 0),
  })).sort((a, b) => b.total - a.total);
  const doubleRingData = projects.reduce((acc, p) => {
    const primarySiteCasesCount = acc[p.primary_site]
      ? acc[p.primary_site].value + p.summary.case_count
      : p.summary.case_count;

    return {
      ...acc,
      [p.primary_site]: {
        value: primarySiteCasesCount,
        tooltip: `<b>${p.primary_site}</b><br />${primarySiteCasesCount} case${primarySiteCasesCount > 1 ? 's' : ''}`,
        clickHandler: () => {
          if (p.primary_site.reduce((acc, s) => acc + FacetService.getActiveIDs('primary_site').indexOf(s), 0) !== 0) {
            p.primary_site.map(s => FacetService.addTerm('primary_site', s));
          } else {
            p.primary_site.map(s => FacetService.removeTerm('primary_site', s));
          }
        },
        outer: [
          ...(acc[p.primary_site] || { outer: [] }).outer,
          {
            key: p.project_id,
            value: p.summary.case_count,
            tooltip: `<b>${p.name}</b><br />${p.summary.case_count} case${p.summary.case_count > 1 ? 's' : 0}`,
            clickHandler: () => {
              if (FacetService.getActiveIDs('project_id').indexOf(p.project_id) !== 0) {
                FacetService.addTerm('project_id', p.project_id);
              } else {
                FacetService.removeTerm('project_id', p.project_id);
              }
            },
          },
        ],
      },
    };
  }, {});

  const totalCases = projects.reduce((sum, p) => sum + p.summary.case_count, 0);

  const color = d3.scaleOrdinal([
    ...d3.schemeCategory20,
    '#CE6DBD',
    '#AD494A',
    '#8C6D31',
    '#B5CF6B',
  ]);
   // there are 24 primary sites
  const projectsInTopGenes = Object.keys(topGenesWithCasesPerProject)
    .reduce((acc, g) => [...acc, ...Object.keys(topGenesWithCasesPerProject[g])], []);

  const primarySiteProjects = projects.sort((a, b) => {
      // sort the projects with top mutated genes to the top so they're colored darker
    if (projectsInTopGenes.indexOf(a.project_id) !== -1 && projectsInTopGenes.indexOf(b.project_id) === -1) {
      return -1;
    }
    if (projectsInTopGenes.indexOf(a.project_id) === -1 && projectsInTopGenes.indexOf(b.project_id) !== -1) {
      return 1;
    }
    return 0;
  }).reduce((acc, p, i) => ({
    ...acc,
    [p.primary_site]: {
      color: acc[p.primary_site] ? acc[p.primary_site].color : color(i),
      projects: [...(acc[p.primary_site] || { projects: [] }).projects, p.project_id],
    },
  }), {});
    // brighten project colors by a multiplier that's based on projects number, so the slices don't get too light
    // and if there's only two slices the colors are different enough
  const primarySiteToColor = Object.keys(primarySiteProjects).reduce((acc, primarySite) => ({
    ...acc,
    [primarySite]: {
      ...primarySiteProjects[primarySite],
      projects: primarySiteProjects[primarySite].projects.reduce((acc, project_id, i) => ({
        ...acc,
        [project_id]: d3.color(primarySiteProjects[primarySite].color)
          .brighter((1 / primarySiteProjects[primarySite].projects.length) * i),
      }), {}),
    },
  }), {});

  return (
    <Row style={{ marginBottom: '2rem', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px' }}>
      <Column flex={3} style={{ paddingRight: '10px', minWidth: '450px' }}>
        <div style={{ alignSelf: 'center', color: '#6b6262', padding: '1.5rem 0 0.5rem', fontWeight: 'bold' }}>
          Top Mutated Genes in Selected Projects
        </div>
        {!genesIsFetching ? [
          <div style={{ alignSelf: 'center', color: '#6b6262', fontSize: '1.2rem' }} key='bar-subtitle'>
            {`${numUniqueCases} Unique Case${numUniqueCases === 0 || numUniqueCases > 1 ? 's' : ''} with Mutation Data`}
          </div>,
          <span style={{ transform: 'scale(0.9)' }}>
            <Measure key='bar-chart'>
              {({ width }) =>
                <StackedBarChart
                  width={width + 100}
                  height={170}
                  data={stackedBarData}
                  projectsIdtoName={projects.reduce((acc, p) => ({ ...acc, [p.project_id]: p.name }), {})}
                  colors={Object.keys(primarySiteToColor)
                    .reduce((acc, pSite) => ({ ...acc, ...primarySiteToColor[pSite].projects }), {})
                  }
                  yAxis={{ title: 'Cases Affected' }}
                  styles={{
                    xAxis: { stroke: theme.greyScale4, textFill: theme.greyScale3 },
                    yAxis: { stroke: theme.greyScale4, textFill: theme.greyScale3 },
                  }}
                />
              }
            </Measure>
          </span>,
        ] :
        <Row style={{ justifyContent: 'center', paddingTop: '2em', paddingBottom: '2em' }}>
          <SpinnerParticle />
        </Row>
        }
      </Column>
      <Column flex={2} style={{ minWidth: '200px' }}>
        <div style={{ alignSelf: 'center', color: '#6b6262', padding: '1.5rem 0 0.5rem', fontWeight: 'bold' }}>
          Case Distribution per Project
        </div>
        {!projectsIsFetching ? [
          <div style={{ alignSelf: 'center', fontSize: '1.2rem', marginBottom: '2rem' }} key='pie-subtitle'>
            {`${totalCases} Case${totalCases === 0 || totalCases > 1 ? 's' : ''}
              across ${projects.length} Project${projects.length === 0 || projects.length > 1 ? 's' : ''}`
            }
          </div>,
          <span style={{ transform: 'scale(0.75)' }}>
            <DoubleRingChart
              key='pie-chart'
              colors={primarySiteToColor}
              data={
                Object.keys(doubleRingData)
                  .map(primary_site => ({
                    key: primary_site,
                    ...doubleRingData[primary_site],
                  })
                )}
              height={200}
              width={200}
            />
          </span>,
        ] :
        <Row style={{ justifyContent: 'center', paddingTop: '2em', paddingBottom: '2em' }}>
          <SpinnerParticle />
        </Row>
        }
      </Column>
    </Row>
  );
};

export default Projects;
