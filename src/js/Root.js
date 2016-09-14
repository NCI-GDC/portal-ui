import { h } from 'react-hyperscript-helpers';
import Relay from 'react-relay';
import { applyRouterMiddleware, Router, browserHistory } from 'react-router';
import useRelay from 'react-router-relay';

import routes from './routes';

// Don't inject everytime file is hot-reloaded
if (!Relay.Store._storeData._networkLayer._implementation) {
  Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer(`${__API__}graphql`)
  );
}

const Root = () => (
  h(Router, {
    history: browserHistory,
    routes,
    render: applyRouterMiddleware(useRelay),
    environment: Relay.Store,
  })
);

export default Root;
