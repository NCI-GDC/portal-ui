/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay';

import CasePage from '@ncigdc/containers/CasePage';
import { prepareNodeParams } from './utils';
import { nodeQuery } from './queries';

class CaseRoute extends Relay.Route {
  static routeName = 'CasePageRoute';
  static queries = nodeQuery;
  static prepareParams = prepareNodeParams('Case');
}

export default (props: mixed) => (
  <Relay.Renderer
    Container={CasePage}
    queryConfig={new CaseRoute(props)}
    environment={Relay.Store}
  />
);
