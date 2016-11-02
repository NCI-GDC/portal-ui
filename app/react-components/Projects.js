// Vendor
import React from 'react';
import Measure from 'react-measure';

// Custom
import Column from './uikit/Flex/Column';
import Row from './uikit/Flex/Row';
import PieChart from './charts/PieChart';
import StackedBarChart from './charts/StackedBarChart';
import theme from './theme';
import SpinnerParticle from './uikit/SpinnerParticle';

let Projects = (() => {
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

  return ({ projects = [], genes = [], FacetService, isFetching }) => {
    const actives = FacetService.getActiveIDs('project_id');
    const projectIds = projects.map(p => p.project_id);
    const stackedBarData = genes.map(g => ({
      symbol: g.symbol,
      gene_id: g.gene_id,
      ...g.case.reduce((acc, c) => (projectIds.includes(c.project.project_id) ? {
      ...acc,
      [c.project.project_id]: acc[c.project.project_id] ? acc[c.project.project_id] + 1 : 1,
      total: acc.total + 1,
      } : acc), { total: 0 })
    })).sort((a, b) => b.total - a.total);

    return  (
      <Row>
        <Column style={{width: '70%', paddingRight: '10px', minWidth: '450px'}}>
          <h4 style={{alignSelf: 'center'}}>Top Mutated Genes in Selected Projects</h4>
          { !isFetching ?
            (<Measure>
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
              </Measure>) : (
                <Row style={{justifyContent: 'center', paddingTop: '2em', paddingBottom: '2em'}}>
                  <SpinnerParticle />
                </Row>
              )
          }
        </Column>
        <Column style={{width: '30%', minWidth: '200px'}}>
          <h4 style={{alignSelf: 'center'}}>Case Distribution per Project</h4>
          { !isFetching ?
            (<PieChart
              key='chart'
              data={projects.map(p => ({
                ...p,
                tooltip: `<b>${p.project_id}</b><br/>${p.summary.case_count} cases`,
                clickHandler: () => {
                    if(FacetService.getActiveIDs('project_id').indexOf(p.project_id) !== 0) {
                      FacetService.addTerm('project_id', p.project_id);
                    } else {
                      FacetService.removeTerm('project_id', p.project_id);
                    }
                  }
                })
              )}
              path='summary.case_count'
              tooltipKey='tooltip'
              height={250}
              width={250}
            />) : (
              <Row style={{justifyContent: 'center', paddingTop: '2em', paddingBottom: '2em'}}>
                <SpinnerParticle />
              </Row>
            )
          }
      </Column>
      </Row>
    );
  }
})()

export default Projects;
