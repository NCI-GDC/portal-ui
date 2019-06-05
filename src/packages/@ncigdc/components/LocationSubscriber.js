// @flow

import { parse } from 'query-string';
import withRouter from '@ncigdc/utils/withRouter';

const LocationSubscriber = ({
  children,
  location,
  push,
}) => children({
  ...location,
  push,
  query: parse(location.search),
});

export default withRouter(LocationSubscriber);
