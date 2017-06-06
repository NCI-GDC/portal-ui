/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay/classic';
import { connect } from 'react-redux';

import { handleStateChange } from '@ncigdc/dux/relayProgress';
import HomePage, { HomePageComponent } from '@ncigdc/containers/HomePage';
import { viewerQuery } from './queries';

class HomeRoute extends Relay.Route {
  static routeName = 'HomePageRoute';
  static queries = viewerQuery;
}

export default connect()((props: mixed) => (
  <Relay.Renderer
    Container={HomePage}
    queryConfig={new HomeRoute(props)}
    environment={Relay.Store}
    render={({ done, error, props, retry, stale }) => {
      if (props) {
        return <HomePage {...props} />;
      } else {
        return <HomePageComponent />;
      }
    }}
    onReadyStateChange={handleStateChange(props)}
  />
));
