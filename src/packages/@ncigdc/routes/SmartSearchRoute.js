// @flow
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay/classic';
import { connect } from 'react-redux';
import { parse } from 'query-string';

import { handleStateChange } from '@ncigdc/dux/relayProgress';
import SmartSearchPage from '@ncigdc/containers/SmartSearchPage';
import {
  parseIntParam,
  parseFilterParam,
  parseJSONParam,
} from '@ncigdc/utils/uri';

import { viewerQuery } from './queries';

class SmartSearchRoute extends Relay.Route {
  static routeName = 'RepositoryRoute';
  static queries = viewerQuery;
  static prepareParams = ({ location: { search } }) => {
    const q = parse(search);

    return {
      cases_offset: parseIntParam(q.cases_offset, 0),
      cases_size: parseIntParam(q.cases_size, 20),
      cases_sort: parseJSONParam(q.cases_sort, null),
      files_offset: parseIntParam(q.files_offset, 0),
      files_size: parseIntParam(q.files_size, 20),
      files_sort: parseJSONParam(q.files_sort, null),
      filters: parseFilterParam(q.filters, null),
    };
  };
}

export default connect()((props: mixed) => (
  <Relay.Renderer
    Container={SmartSearchPage}
    queryConfig={new SmartSearchRoute(props)}
    environment={Relay.Store}
    onReadyStateChange={handleStateChange(props)}
  />
));
