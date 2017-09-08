import Component from './ProjectsCharts';
import withProjects from './ProjectsCharts.relay';
import withGenesAndCases from './GenesAndCases.relay';
import withTopCasesCounts from './TopCasesCountByGenes.relay';
export default withProjects(withGenesAndCases(withTopCasesCounts(Component)));
