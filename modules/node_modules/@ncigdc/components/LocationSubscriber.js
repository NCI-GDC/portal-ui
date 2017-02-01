// @flow

import { parse } from 'query-string';
import { withRouter } from 'react-router-dom';

const LocationSubscriber = withRouter(({ location, children }) => (
  children(({ ...location, query: parse(location.search) }))
));

export default LocationSubscriber;
