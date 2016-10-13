/* @flow */
/* eslint better/no-ifs:0 */

import React from 'react';
import Relay from 'react-relay';
import Router from 'react-router/BrowserRouter';
import { stringify } from 'query-string';

import { viewerQuery } from '@ncigdc/routes/queries';

const stringifyQuery = (query) => (
  stringify(query, { strict: false })
);

// $FlowIgnore
const Container = LEGACY ? require('./Legacy').default : require('./Portal').default;

// Don't inject everytime file is hot-reloaded
if (!Relay.Store._storeData._networkLayer._implementation) {
  Relay.injectNetworkLayer(
    // $FlowIgnore
    new Relay.DefaultNetworkLayer(`${API}graphql`)
  );
}

class Route extends Relay.Route {
  static routeName = 'RootRoute';
  static queries = viewerQuery;
}

const Root = (props: mixed) => (
  <Router stringifyQuery={stringifyQuery}>
    <Relay.Renderer
      Container={Container}
      queryConfig={new Route(props)}
      environment={Relay.Store}
    />
  </Router>
);

export default Root;
