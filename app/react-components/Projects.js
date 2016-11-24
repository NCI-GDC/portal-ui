/* @flow */
// Vendor
import React from 'react';
import Measure from 'react-measure';

// Custom
import Column from './uikit/Flex/Column';
import Row from './uikit/Flex/Row';
import DoubleRingChart from './charts/DoubleRingChart';
import StackedBarChart from './charts/StackedBarChart';
import theme from './theme';
import SpinnerParticle from './uikit/SpinnerParticle';

let Projects = ({
    projects = [],
    topGenesWithCasesPerProject = {},
    FacetService,
    projectsIsFetching,
    genesIsFetching,
    numUniqueCases
  }: {
    projects: Array<Object>,
    topGenesWithCasesPerProject: { [gene_id: string] : { [project_id: string]: number, symbol: string}},
    numUniqueCases: number,
    FacetService: any,
    projectsIsFetching: boolean,
    genesIsFetching: boolean,
  }) => {
  const styles = {
    container: {
      width: '100%',
      margin: 'auto',
    },
    heading: {
      flexGrow: 1,
      fontSize: '2rem',
      marginBottom: 7,
      marginTop: 7,
    },
    column: {
      minWidth: 450,
    },
  };

  const actives = FacetService.getActiveIDs('project_id');
  const projectIds = projects.map(p => p.project_id);
  const stackedBarData = Object.keys(topGenesWithCasesPerProject).map(
    (geneId) => ({
      symbol: topGenesWithCasesPerProject[geneId].symbol,
      gene_id: geneId,
      ...topGenesWithCasesPerProject[geneId],
      total: Object.keys(topGenesWithCasesPerProject[geneId]).filter(k => k !== 'symbol').reduce((sum, projectId) => sum + topGenesWithCasesPerProject[geneId][projectId], 0)
    })
  ).sort((a, b) => b.total - a.total);
  //const caseCount = stackedBarData.reduce((sum, d) => sum + d.total, 0);
  const doubleRingData = projects.reduce((acc, p) => {
    return {...acc,
      [p.primary_site]: {
        value: acc[p.primary_site] ? acc[p.primary_site].value + p.summary.case_count : p.summary.case_count,
        clickHandler: () => {
          if(p.primary_site.reduce((acc, s) => acc + FacetService.getActiveIDs('primary_site').indexOf(s), 0) !== 0) {
            p.primary_site.map(s => FacetService.addTerm('primary_site', s));
          } else {
            p.primary_site.map(s => FacetService.removeTerm('primary_site', s));
          }
        },
        outer: [
          ...(acc[p.primary_site] || {outer: []}).outer,
          {
            label: p.project_id,
            value: p.summary.case_count,
            clickHandler: () => {
              if(FacetService.getActiveIDs('project_id').indexOf(p.project_id) !== 0) {
                FacetService.addTerm('project_id', p.project_id);
              } else {
                FacetService.removeTerm('project_id', p.project_id);
              }
            }
          }
        ]
      }
    }}, {});
    return  (
      <Row>
        <Column style={{width: '70%', paddingRight: '10px', minWidth: '450px'}}>
          <h4 style={{alignSelf: 'center'}}>Top Mutated Genes in Selected Projects</h4>
          { !genesIsFetching ?
            ( [
              <h5 style={{alignSelf: 'center'}} key='bar-subtitle'>
                {numUniqueCases} Unique SSM-tested Cases
              </h5>,
              <Measure key='bar-chart'>
              {({width}) => (
              <StackedBarChart
                width={width}
                height={200}
                data={stackedBarData}
                yAxis={{ title: 'Cases Affected' }}
                styles={{
                    xAxis: {stroke: theme.greyScale4, textFill: theme.greyScale3},
                    yAxis: {stroke: theme.greyScale4, textFill: theme.greyScale3},
                }}
              />)}
              </Measure>]) : (
                <Row style={{justifyContent: 'center', paddingTop: '2em', paddingBottom: '2em'}}>
                  <SpinnerParticle />
                </Row>
              )
          }
        </Column>
        <Column style={{width: '30%', minWidth: '200px'}}>
          <h4 style={{alignSelf: 'center'}}>Case Distribution per Project</h4>
          { !projectsIsFetching ?
            ([
              <h5 style={{alignSelf: 'center'}} key='pie-subtitle'>
                {projects.reduce((sum, p) => sum + p.summary.case_count, 0)} Cases across {projects.length} Projects
              </h5>,
              <DoubleRingChart
              key='pie-chart'
              data={Object.keys(doubleRingData)
                .map(primary_site =>
                 ({ label: primary_site,
                  ...doubleRingData[primary_site],
                 })
              )}
              height={250}
              width={250}
              />]) : (
              <Row style={{justifyContent: 'center', paddingTop: '2em', paddingBottom: '2em'}}>
                <SpinnerParticle />
              </Row>
            )
          }
      </Column>
      </Row>
    );
};

export default Projects;
