/* @flow */
/* eslint better/no-ifs:0, import/no-commonjs:0, fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay/classic';
import { parse } from 'query-string';
import md5 from 'blueimp-md5';
import urlJoin from 'url-join';
import { RelayNetworkLayer, urlMiddleware } from 'react-relay-network-layer';
import retryMiddleware from '@ncigdc/utils/retryMiddleware';

import { viewerQuery } from '@ncigdc/routes/queries';
import Container from './Portal';

Relay.injectNetworkLayer(
  new RelayNetworkLayer([
    urlMiddleware({
      url: req => urlJoin(process.env.REACT_APP_API, 'graphql'),
    }),
    retryMiddleware({
      fetchTimeout: 15000,
      retryDelays: attempt => Math.pow(2, attempt + 4) * 100, // or simple array [3200, 6400, 12800, 25600, 51200, 102400, 204800, 409600],
      forceRetry: (cb, delay) => {
        window.forceRelayRetry = cb;
        console.log(
          `call \`forceRelayRetry()\` for immediately retry! Or wait ${delay} ms.`,
        );
      },
      statusCodes: [500, 503, 504],
    }),
    // Add hash id to request
    next => req => {
      const [url, search = ''] = req.url.split('?');
      const hash =
        parse(search).hash ||
        md5(
          [
            req.relayReqObj._printedQuery.text,
            JSON.stringify(req.relayReqObj._printedQuery.variables),
          ].join(':'),
        );

      req.url = `${url}?hash=${hash}`;
      return next(req);
    },
  ]),
);

class Route extends Relay.Route {
  static routeName = 'RootRoute';
  static queries = viewerQuery;
}

const Root = (props: mixed) =>
  <Relay.Renderer
    Container={Container}
    queryConfig={new Route(props)}
    environment={Relay.Store}
  />;

export default Root;
