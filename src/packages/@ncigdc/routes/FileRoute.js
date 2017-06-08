/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay/classic';
import { connect } from 'react-redux';

import { handleStateChange } from '@ncigdc/dux/relayProgress';
import FilePage from '@ncigdc/containers/FilePage';
import { prepareNodeParams } from '@ncigdc/utils/routes';
import NotFound from '@ncigdc/components/NotFound';
import Loader from '@ncigdc/uikit/Loaders/Loader';

import { nodeQuery } from './queries';

class FileRoute extends Relay.Route {
  static routeName = 'FilePageRoute';
  static queries = nodeQuery;
  static prepareParams = prepareNodeParams('File');
}

export default connect()((routeProps: mixed) =>
  <Relay.Renderer
    Container={FilePage}
    queryConfig={new FileRoute(routeProps)}
    environment={Relay.Store}
    onReadyStateChange={handleStateChange(routeProps)}
    render={({ error, props }) => {
      if (error) {
        return <NotFound />;
      } else if (props) {
        return <FilePage {...props} />;
      }
      return <Loader />;
    }}
  />,
);
