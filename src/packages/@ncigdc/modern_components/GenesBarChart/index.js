import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';

const GenesBarChart = LoadableWithLoading({
  loader: () => import('./GenesBarChart'),
});
export default GenesBarChart;
