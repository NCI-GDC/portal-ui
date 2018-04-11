// @flow

import { parse } from 'query-string';
import withRouter from '@ncigdc/utils/withRouter';

const LocationSubscriber = withRouter(({ location, children, push }) =>
  children({ ...location, query: parse(location.search), push }),
);

export default LocationSubscriber;
