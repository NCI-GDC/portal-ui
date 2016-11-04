/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay';

import SearchPage from '@ncigdc/containers/SearchPage';
import { prepareViewerParams } from '@ncigdc/utils/routes';

import { viewerQuery } from './queries';

class SearchRoute extends Relay.Route {
  static routeName = 'SearchRoute';
  static queries = viewerQuery;
  static prepareParams = prepareViewerParams;
}

export default (props: mixed) => (
  <Relay.Renderer
    Container={SearchPage}
    queryConfig={new SearchRoute(props)}
    environment={Relay.Store}
  />
);
