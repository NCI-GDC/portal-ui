/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay/classic';
import { connect } from 'react-redux';
import { parse } from 'query-string';

import { handleStateChange } from '@ncigdc/dux/relayProgress';
import ExplorePage from '@ncigdc/containers/explore/ExplorePage';
import {
  parseIntParam,
  parseFilterParam,
  parseJSONParam,
} from '@ncigdc/utils/uri';

import { viewerQuery } from './queries';

class ExploreRoute extends Relay.Route {
  static routeName = 'ExploreRoute';

  static queries = {
    ...viewerQuery,
    //autocomplete: () => Relay.QL`query { explore }`,
  };

  static prepareParams = ({ location: { search } }) => {
    const q = parse(search);

    return {
      filters: parseFilterParam(q.filters, null),
      cases_offset: parseIntParam(q.cases_offset, 0),
      cases_size: parseIntParam(q.cases_size, 20),
      cases_sort: parseJSONParam(q.cases_sort, null),
    };
  };
}

export default connect()((props: mixed) => (
  <Relay.Renderer
    Container={ExplorePage}
    queryConfig={new ExploreRoute(props)}
    environment={Relay.Store}
    onReadyStateChange={handleStateChange(props)}
  />
));
