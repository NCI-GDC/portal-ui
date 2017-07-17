import Component from './CancerDistributionTable';
import createRenderer from './CancerDistributionTable.relay';
import createRendererProjects from './Projects.relay';
export default createRenderer(createRendererProjects(Component));
