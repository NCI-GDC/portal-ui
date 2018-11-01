import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';
import CancerDistributionTable from './CancerDistributionTable';
import createRenderer from './CancerDistributionTable.relay';
import createRendererProjects from './Projects.relay';

const AsyncComponent = LoadableWithLoading({
  loader: () =>  CancerDistributionTable,
});

export default createRenderer(createRendererProjects(AsyncComponent));
