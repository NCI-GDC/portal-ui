/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay';

import AnnotationsPage from 'containers/AnnotationsPage';
import { prepareViewerParams } from 'routes/utils';
import { viewerQuery } from 'routes/queries';

class AnnotationsRoute extends Relay.Route {
  static routeName = 'AnnotationsRoute';
  static queries = viewerQuery;
  static prepareParams = prepareViewerParams;
}

export default (props: mixed) => (
  <Relay.Renderer
    Container={AnnotationsPage}
    queryConfig={new AnnotationsRoute(props)}
    environment={Relay.Store}
  />
);
