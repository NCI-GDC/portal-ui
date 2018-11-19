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
import { compose, lifecycle, withPropsOnChange } from 'recompose';

import setupStore from '@ncigdc/dux';
import { fetchApiVersionInfo } from '@ncigdc/dux/versionInfo';
import { viewerQuery } from '@ncigdc/routes/queries';
import Container from './Portal';
import { API, IS_AUTH_PORTAL, FENCE } from '@ncigdc/utils/constants';
import { fetchUser, forceLogout, setUserAccess } from '@ncigdc/dux/auth';
import Login from '@ncigdc/routes/Login';
import { redirectToLogin } from '@ncigdc/utils/auth';

const retryStatusCodes = [500, 503, 504];

const AccessError = message => {
  this.message = message;
  this.name = 'AccessError';
  return this;
};

const awgLogout = async () => {
  console.log('awg logout');
  await fetch(urlJoin(FENCE, 'logout'), {
    credentials: 'include',
  });
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
          `call \`forceRelayRetry()\` for immediately retry! Or wait ${delay} ms.`,
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
          ].join(':'),
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
          console.log('loading Root! ', res);
          if (!res.ok && !retryStatusCodes.includes(res.status)) {
            console.log('throwing error in Root');
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
          console.log('bananas: ', err);
          let { user } = window.store.getState().auth;
          if (err.status) {
            switch (err.status) {
              case 401:
              case 403:
                console.log(err.statusText);
                // need to check for user so first request to portal does not show timeout error
                if (IS_AUTH_PORTAL && user) {
                  return redirectToLogin('timeout');
                }
                break;
              case 400:
              case 404:
                console.log(err.statusText);
                break;
              default:
                return console.log('there was an error', err.statusText);
            }
          } else if (err.name === 'AccessError') {
            console.log('access error message: ', err.message);
            awgLogout();
            window.store.dispatch(forceLogout());
            // return redirectToLogin(err.message);
            return (window.location.href = `/login?error=${err.message}`);
          } else {
            console.log('Something went wrong');
          }
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
    intersection: props.intersection,
    fence_projects: props.fence_projects,
    nih_projects: props.nih_projects,
  });
});

const Root = (props: mixed) => (
  console.log('Root component loading'),
  (
    <Router>
      <Provider store={store}>
        <React.Fragment>
          {!IS_AUTH_PORTAL ? (
            <Relay.Renderer
              Container={Container}
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
                      console.log('HasUser component');
                      if (
                        failed &&
                        error.message === 'Session timed out or not authorized'
                      ) {
                        console.log('user request failed with error message');
                        return redirectToLogin('timeout');
                      }
                      if (failed) {
                        console.log('user request failed');
                        return <Redirect to="/login" />;
                      }
                      if (user) {
                        console.log('user is set');
                        // if access is not correct
                        // console.log('fence: ', fence_projects);
                        // console.log('nih: ', nih_projects);
                        // console.log('intersection: ', intersection);
                        // if (!fence_projects) {
                        //   console.log('no fence projects');
                        //   return <Redirect to="/login?error=no_fence_projects" />;
                        // }
                        // if (!nih_projects) {
                        //   console.log('no nih projects');
                        //   return <Redirect to="/login?error=no_nih_projects" />;
                        // }
                        // if (!intersection) {
                        //   console.log('no intersection');
                        //   return <Redirect to="/login?error=no_intersection" />;
                        // }
                        return (
                          <Relay.Renderer
                            Container={Container}
                            queryConfig={new RelayRoute(props)}
                            environment={Relay.Store}
                          />
                        );
                      }
                      console.log(
                        'does not meet any criteria, redirecting to login',
                      );
                      return <Redirect to="/login" />;
                    }}
                  </HasUser>
                )}
              />
            </Switch>
          )}
        </React.Fragment>
      </Provider>
    </Router>
  )
);

export default Root;
