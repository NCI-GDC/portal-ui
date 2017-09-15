import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';
import createRenderer from './CancerDistributionTable.relay';
import createRendererProjects from './Projects.relay';

const AsyncComponent = LoadableWithLoading({
  loader: () => import('./CancerDistributionTable'),
});

export default createRenderer(createRendererProjects(AsyncComponent));
