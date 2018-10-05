import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';
import createRenderer from './CancerDistributionSsmTable.relay';
import createRendererProjects from '../CancerDistributionTable/Projects.relay';

const AsyncComponent = LoadableWithLoading({
  loader: () => import('../CancerDistributionTable/CancerDistributionTable'),
});

export default createRenderer(createRendererProjects(AsyncComponent));
