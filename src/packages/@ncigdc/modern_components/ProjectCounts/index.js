import ProjectCountsDataCategoryComponent from './ProjectCountsDataCategory';
import ProjectCountsExpStrategyComponent from './ProjectCountsExpStrategy';
import createRenderer from './ProjectCounts.relay';

const ProjectCountsDataCategory = createRenderer(
  ProjectCountsDataCategoryComponent,
);
const ProjectCountsExpStrategy = createRenderer(
  ProjectCountsExpStrategyComponent,
);

export { ProjectCountsDataCategory, ProjectCountsExpStrategy };
