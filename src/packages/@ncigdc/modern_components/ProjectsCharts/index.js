import Component from './ProjectsCharts';
import withProjects from './ProjectsCharts.query';
import withGenesAndCases from './GenesAndCases.query';
import withTopCasesCounts from './TopCasesCountByGenes.query';
export default withProjects(withGenesAndCases(withTopCasesCounts(Component)));
