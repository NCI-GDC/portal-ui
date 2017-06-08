/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import { connect } from 'react-redux';
import Relay from 'react-relay/classic';

import { handleStateChange } from '@ncigdc/dux/relayProgress';
import AnnotationPage from '@ncigdc/containers/AnnotationPage';
import { prepareNodeParams } from '@ncigdc/utils/routes';
import NotFound from '@ncigdc/components/NotFound';
import Loader from '@ncigdc/uikit/Loaders/Loader';

import { nodeQuery } from './queries';

class AnnotationRoute extends Relay.Route {
  static routeName = 'AnnotationPageRoute';
  static queries = nodeQuery;
  static prepareParams = prepareNodeParams('Annotation');
}

export default connect()((routeProps: mixed) =>
  <Relay.Renderer
    Container={AnnotationPage}
    queryConfig={new AnnotationRoute(routeProps)}
    environment={Relay.Store}
    onReadyStateChange={handleStateChange(routeProps)}
    render={({ error, props }) => {
      if (error) {
        return <NotFound />;
      } else if (props) {
        return <AnnotationPage {...props} />;
      }
      return <Loader />;
    }}
  />,
);
