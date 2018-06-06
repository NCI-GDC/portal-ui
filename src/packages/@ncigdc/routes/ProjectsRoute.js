/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay/classic';
import { connect } from 'react-redux';
import { parse } from 'query-string';

import { handleStateChange } from '@ncigdc/dux/relayProgress';
import ProjectsPage from '@ncigdc/containers/ProjectsPage';
import {
  parseIntParam,
  parseFilterParam,
  parseJSONParam,
} from '@ncigdc/utils/uri';

import { viewerQuery } from './queries';

const DEFAULT_PROJECT_SORT = [{ field: 'summary.case_count', order: 'desc' }];

class ProjectsRoute extends Relay.Route {
  static routeName = 'ProjectsRoute';

  static queries = viewerQuery;

  static prepareParams = ({ location: { search } }) => {
    const q = parse(search);

    return {
      offset: parseIntParam(q.offset, 0),
      size: 1000,
      filters: parseFilterParam(q.filters, null),
      projects_sort: parseJSONParam(q.projects_sort, DEFAULT_PROJECT_SORT),
    };
  };
}

export default connect()((props: mixed) => (
  <Relay.Renderer
    Container={ProjectsPage}
    queryConfig={new ProjectsRoute(props)}
    environment={Relay.Store}
    onReadyStateChange={handleStateChange(props)}
  />
));
