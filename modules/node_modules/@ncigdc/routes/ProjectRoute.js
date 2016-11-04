/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay';

import ProjectPage from '@ncigdc/containers/ProjectPage';
import { prepareNodeParams } from '@ncigdc/utils/routes';
import { nodeQuery } from './queries';

class ProjectRoute extends Relay.Route {
  static routeName = 'ProjectPageRoute';
  static queries = nodeQuery;
  static prepareParams = prepareNodeParams('Project');
}

export default (props: mixed) => (
  <Relay.Renderer
    Container={ProjectPage}
    queryConfig={new ProjectRoute(props)}
    environment={Relay.Store}
  />
);
