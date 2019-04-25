/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay/classic';
import { connect } from 'react-redux';
import { parse } from 'query-string';

import { handleStateChange } from '@ncigdc/dux/relayProgress';
import AnnotationsPage from '@ncigdc/containers/AnnotationsPage';
import {
  parseIntParam,
  parseFilterParam,
  parseJSONParam,
} from '@ncigdc/utils/uri';

import { viewerQuery } from './queries';

class AnnotationsRoute extends Relay.Route {
  static routeName = 'AnnotationsRoute';

  static queries = viewerQuery;

  static prepareParams = ({ location: { search } }) => {
    const q = parse(search);

    return {
      annotations_offset: parseIntParam(q.annotations_offset, 0),
      annotations_size: parseIntParam(q.annotations_size, 20),
      filters: parseFilterParam(q.filters, null),
      annotations_sort: parseJSONParam(q.annotations_sort, null),
    };
  };
}

export default connect()((props: mixed) => (
  <Relay.Renderer
    Container={AnnotationsPage}
    environment={Relay.Store}
    onReadyStateChange={handleStateChange(props)}
    queryConfig={new AnnotationsRoute(props)} />
));
