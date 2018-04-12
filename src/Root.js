/* @flow */
/* eslint better/no-ifs:0, import/no-commonjs:0, fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay/classic';
import { parse } from 'query-string';
import md5 from 'blueimp-md5';
import urlJoin from 'url-join';
import { RelayNetworkLayer, urlMiddleware } from 'react-relay-network-layer';
import retryMiddleware from '@ncigdc/utils/retryMiddleware';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { viewerQuery } from '@ncigdc/routes/queries';
import Login from '@ncigdc/routes/Login';
import Container from './Portal';
import { API } from '@ncigdc/utils/constants';
import { clear } from '@ncigdc/utils/cookies';
import { Provider, connect } from 'react-redux';
import setupStore from '@ncigdc/dux';
import { fetchApiVersionInfo } from '@ncigdc/dux/versionInfo';
import { fetchUser } from '@ncigdc/dux/auth';

Relay.injectNetworkLayer(
  new RelayNetworkLayer([
    urlMiddleware({
      url: req => urlJoin(API, 'graphql'),
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

      req.credentials = 'include';

      let { user } = window.store.getState().auth;

      let parsedBody = JSON.parse(req.body);
      let body = { ...parsedBody, user };
      req.body = JSON.stringify(body);

      req.url = `${url}?hash=${hash}`;

      return next(req).then(res => {
        let { json } = res;

        window.intersection = json.intersection;

        let tries = 20;
        let id = setInterval(() => {
          let { user } = window.store.getState().auth;

          console.log('tries', tries);
          console.log('/graphql', user, json);

          if (user) {
            if (!json.fence_projects.length) {
              clear();
              window.location.href = '/login?error=no_fence_projects';
              return;
            }

            if (!json.nih_projects.length) {
              clear();
              window.location.href = '/login?error=no_nih_projects';
              return;
            }

            if (!json.intersection.length) {
              clear();
              window.location.href = '/login?error=no_intersection';
              return;
            }
          }

          tries--;

          if (!tries) clearInterval(id);
        }, 500);

        return res;
      });
    },
  ]),
);

export const store = setupStore({
  persistConfig: {
    keyPrefix: 'ncigdcActive',
  },
});

window.store = store;

store.dispatch(fetchApiVersionInfo());

if (process.env.NODE_ENV !== 'development') {
  store.dispatch(fetchUser());
}

class RelayRoute extends Relay.Route {
  static routeName = 'RootRoute';
  static queries = viewerQuery;
}

let HasUser = connect(state => state.auth)(props => {
  return props.children({
    user: props.user,
    failed: props.failed,
    error: props.error,
  });
});

const Root = (props: mixed) => (
  <Router>
    <Provider store={store}>
      <React.Fragment>
        <Route exact path="/login" component={Login} />
        <Route
          render={props => {
            return (
              !window.location.pathname.includes('/login') && (
                <HasUser>
                  {({ user, failed, error }) => {
                    // if (
                    //   error &&
                    //   error.message === 'Session timed out or not authorized'
                    // )
                    //   return <Redirect to="/login?error=timeout" />;
                    if (failed)
                      return <Redirect to="/login?error=no_nih_projects" />;
                    if (user)
                      return (
                        <Relay.Renderer
                          Container={Container}
                          queryConfig={new RelayRoute(props)}
                          environment={Relay.Store}
                        />
                      );
                    return null;
                  }}
                </HasUser>
              )
            );
          }}
        />
      </React.Fragment>
    </Provider>
  </Router>
);

export default Root;
