import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';
import withCaseData from './ExploreCasesTable.relay';
import withSsmData from './ExploreCasesSsmsAggregations.relay';

const Component = LoadableWithLoading({
  loader: () => import('./ExploreCasesTable'),
});

export default withCaseData(withSsmData(Component));
