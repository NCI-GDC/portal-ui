/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay';

import FilePage from 'containers/FilePage';
import { prepareNodeParams } from './utils';
import { nodeQuery } from './queries';

class FileRoute extends Relay.Route {
  static routeName = 'FilePageRoute';
  static queries = nodeQuery;
  static prepareParams = prepareNodeParams('File');
}

export default (props: mixed) => (
  <Relay.Renderer
    Container={FilePage}
    queryConfig={new FileRoute(props)}
    environment={Relay.Store}
  />
);
