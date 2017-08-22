import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';
import createRenderer from './CancerDistributionBarChart.relay';

const AsyncComponent = LoadableWithLoading({
  loader: () => import('./CancerDistributionBarChart'),
});

export default createRenderer(AsyncComponent);
