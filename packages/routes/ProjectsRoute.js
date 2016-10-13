/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay';

import ProjectsPage from '@ncigdc/containers/ProjectsPage';
import { prepareViewerParams } from '@ncigdc/utils/routes';
import { viewerQuery } from './queries';

class ProjectsRoute extends Relay.Route {
  static routeName = 'ProjectsRoute';
  static queries = viewerQuery;
  static prepareParams = prepareViewerParams;
}

export default (props: mixed) => (
  <Relay.Renderer
    Container={ProjectsPage}
    queryConfig={new ProjectsRoute(props)}
    environment={Relay.Store}
  />
);
