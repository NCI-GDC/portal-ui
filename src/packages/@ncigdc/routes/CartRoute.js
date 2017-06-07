/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay/classic';
import { parse } from 'query-string';
import { connect } from 'react-redux';

import { handleStateChange } from '@ncigdc/dux/relayProgress';
import CartPage from '@ncigdc/containers/CartPage';
import { parseIntParam, parseJSURLParam } from '@ncigdc/utils/uri';
import { setFilter } from '@ncigdc/utils/filters';

import { viewerQuery } from './queries';

class CartRoute extends Relay.Route {
  static routeName = 'CartRoute';
  static queries = viewerQuery;
  static prepareParams = ({ location: { search }, files }) => {
    const q = parse(search);

    return {
      files_offset: parseIntParam(q.files_offset, 0),
      files_size: parseIntParam(q.files_size, 20),
      files_sort: parseJSURLParam(q.files_sort, null),
      filters: files.length
        ? setFilter({
            field: 'files.file_id',
            value: files.map(f => f.file_id),
          })
        : null,
    };
  };
}

export default connect(state => state.cart)((props: mixed) => (
  <Relay.Renderer
    Container={CartPage}
    queryConfig={new CartRoute(props)}
    environment={Relay.Store}
    onReadyStateChange={handleStateChange(props)}
  />
));
