// Vendor
import React from 'react';

// Custom
import Column from './uikit/Flex/Column';
import PieChart from './charts/PieChart';

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
      width: '100%',
      minWidth: 450,
    },
  };

  return ({ projects }) => {
    return  (
      <Column style={styles.container}>
        Case Distribution per Project
        <PieChart
          key='chart'
          data={projects.map(p => ({...p, tooltip: `${p.project_id}: ${p.summary.case_count} cases`}))}
          path='summary.case_count'
          tooltipKey='tooltip'
          height={250}
          width={250}
        />
      </Column>
    );
  }
})()

export default Projects;
