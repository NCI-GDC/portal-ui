import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';
import createRenderer from './CancerDistributionSsmBarChart.relay';

const AsyncComponent = LoadableWithLoading({
  loader: () =>
    import('../CancerDistributionBarChart/CancerDistributionBarChart'),
});

export default createRenderer(AsyncComponent);
