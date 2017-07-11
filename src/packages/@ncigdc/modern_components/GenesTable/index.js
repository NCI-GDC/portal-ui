import Component from './GenesTable';
import createRendererGenesTable from './GenesTable.relay';
import createRendererSsmsAggregations from './SsmsAggregations.relay';
export default createRendererGenesTable(
  createRendererSsmsAggregations(Component),
);
