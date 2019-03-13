/* @flow */
/* eslint better/no-ifs:0, import/no-commonjs:0, fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay/classic';
import { parse } from 'query-string';
import md5 from 'blueimp-md5';
import urlJoin from 'url-join';
import { RelayNetworkLayer, urlMiddleware } from 'react-relay-network-layer';
import retryMiddleware from '@ncigdc/utils/retryMiddleware';
import { Provider, connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { PersistGate } from 'redux-persist/lib/integration/react';

import setupStore from '@ncigdc/dux';
import { fetchApiVersionInfo } from '@ncigdc/dux/versionInfo';
import { viewerQuery } from '@ncigdc/routes/queries';
import Portal from './Portal';
import { API, IS_AUTH_PORTAL, AWG } from '@ncigdc/utils/constants';
import { fetchUser, forceLogout } from '@ncigdc/dux/auth';
import Login from '@ncigdc/routes/Login';
import { redirectToLogin } from '@ncigdc/utils/auth';
import consoleDebug from '@ncigdc/utils/consoleDebug';
import { fetchNotifications } from '@ncigdc/dux/bannerNotification';
import Loader from '@ncigdc/uikit/Loaders/Loader';

const retryStatusCodes = [500, 503, 504];

const AccessError = message => {
  let instance = new Error(message);
  instance.name = 'AccessError';
  return instance;
};

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
          `call \`forceRelayRetry()\` for immediately retry! Or wait ${delay} ms.`
        );
      },
      statusCodes: retryStatusCodes,
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
          ].join(':')
        );

      req.url = `${url}?hash=${hash}`;

      if (!IS_AUTH_PORTAL) {
        return next(req);
      }

      req.credentials = 'include';

      let { user } = window.store.getState().auth;

      let parsedBody = JSON.parse(req.body);
      req.body = JSON.stringify(parsedBody);
      return next(req)
        .then(res => {
          if (!res.ok && !retryStatusCodes.includes(res.status)) {
            consoleDebug('Throwing error in Root');
            throw res;
          }

          let { json } = res;
          let { user } = window.store.getState().auth;

          if (user) {
            if (!json.fence_projects[0]) {
              throw new AccessError('no_fence_projects');
            }

            if (!json.nih_projects) {
              throw new AccessError('no_nih_projects');
            }

            if (!json.intersection[0]) {
              throw new AccessError('no_intersection');
            }
          }

          return res;
        })
        .catch(err => {
          let { user } = window.store.getState().auth;
          if (err.name === 'AccessError') {
            consoleDebug(`Access error message: ${err.message}`);
            return redirectToLogin(err.message);
          } else {
            consoleDebug(`Something went wrong in Root network layer: ${err}`);
            // not able to pass the response status from throw so need to exclude by error message
            let errorMessage = err.message
              ? JSON.parse(err.message).message
              : null;
            if (
              IS_AUTH_PORTAL &&
              user &&
              errorMessage ===
                'Your token is invalid or expired. Please get a new token from GDC Data Portal.'
            ) {
              return redirectToLogin('timeout');
            }
          }
        });
    },
  ])
);

export const { store, persistor } = setupStore({
  persistConfig: {
    keyPrefix: 'ncigdcActive',
  },
});

window.store = store;

store.dispatch(fetchApiVersionInfo());

if (process.env.NODE_ENV !== 'development') {
  store.dispatch(fetchUser());
  if (!AWG) {
    store.dispatch(fetchNotifications());
  }
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
  <Provider store={store}>
    <PersistGate loading={<Loader />} persistor={persistor}>
      <Router>
        <React.Fragment>
          {!IS_AUTH_PORTAL ? (
            <Relay.Renderer
              Container={Portal}
              queryConfig={new RelayRoute(props)}
              environment={Relay.Store}
            />
          ) : (
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route
                render={props => (
                  <HasUser>
                    {({ user, failed, error }) => {
                      // if user request fails
                      consoleDebug('Root component user: ', user);
                      if (
                        failed &&
                        error.message === 'Session timed out or not authorized'
                      ) {
                        consoleDebug('User request failed with error message');
                        return <Redirect to="/login?error=timeout" />;
                      }
                      if (failed) {
                        consoleDebug('User request failed');
                        return <Redirect to="/login" />;
                      }
                      if (user) {
                        consoleDebug('Has a user, rendering container');
                        return (
                          <Relay.Renderer
                            Container={Portal}
                            queryConfig={new RelayRoute(props)}
                            environment={Relay.Store}
                          />
                        );
                      }
                      consoleDebug(
                        'Response does not match any criteria, redirecting to login',
                      );
                      return <Redirect to="/login" />;
                    }}
                  </HasUser>
                )}
              />
            </Switch>
          )}
        </React.Fragment>
      </Router>
    </PersistGate>
  </Provider>
);

export default Root;
