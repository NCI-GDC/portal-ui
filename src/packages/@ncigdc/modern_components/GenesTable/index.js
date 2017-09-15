import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';
import createRendererGenesTable from './GenesTable.relay';
import createRendererSsmsAggregations from './SsmsAggregations.relay';

const Component = LoadableWithLoading({
  loader: () => import('./GenesTable'),
});

export default createRendererGenesTable(
  createRendererSsmsAggregations(Component),
);
