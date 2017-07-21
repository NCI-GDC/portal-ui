import Component from './ProjectsCharts';
import createRendererProjects from './ProjectsCharts.relay';
import createRendererGenesAndCases from './GenesAndCases.relay';
import createRendererTopCasesCounts from './TopCasesCountByGenes.relay';
export default createRendererProjects(
  createRendererGenesAndCases(createRendererTopCasesCounts(Component)),
);
