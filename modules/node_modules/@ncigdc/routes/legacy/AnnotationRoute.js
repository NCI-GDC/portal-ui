/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay';

import AnnotationPage from '@ncigdc/containers/legacy/AnnotationPage';
import { prepareNodeParams } from '@ncigdc/utils/routes';

import { nodeQuery } from './queries';

class AnnotationRoute extends Relay.Route {
  static routeName = 'LegacyAnnotationPageRoute';
  static queries = nodeQuery;
  static prepareParams = prepareNodeParams('Annotation');
}

export default (props: mixed) => (
  <Relay.Renderer
    Container={AnnotationPage}
    queryConfig={new AnnotationRoute(props)}
    environment={Relay.Store}
  />
);
