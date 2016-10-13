/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay';

import FilesPage from '@ncigdc/containers/legacy/FilesPage';
import { prepareViewerParams } from '@ncigdc/utils/routes';

import { viewerQuery } from './queries';

class FilesRoute extends Relay.Route {
  static routeName = 'LegacyFilesPage';
  static queries = viewerQuery;
  static prepareParams = prepareViewerParams;
}

export default (props: mixed) => (
  <Relay.Renderer
    Container={FilesPage}
    queryConfig={new FilesRoute(props)}
    environment={Relay.Store}
  />
);
