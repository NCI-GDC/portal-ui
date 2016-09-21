/* @flow */
/* eslint better/no-ifs:0 */

import React from 'react';
import Relay from 'react-relay';
import { viewerQuery } from 'routes/queries';

import App from 'containers/App';

// Don't inject everytime file is hot-reloaded
if (!Relay.Store._storeData._networkLayer._implementation) {
  Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer(`${__API__}graphql`)
  );
}

const AppRoute = {
  name: 'AppRoute',
  queries: viewerQuery,
  params: {},
};

const Root = () => (
  <Relay.Renderer
    Container={App}
    queryConfig={AppRoute}
    environment={Relay.Store}
  />
);

export default Root;
