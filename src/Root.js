import React from 'react';
import Relay from 'react-relay/classic';
import { isEqual } from 'lodash';
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
import {
  compose,
  lifecycle,
  setDisplayName,
  withHandlers,
  withPropsOnChange,
} from 'recompose';

import { withControlledAccessContext } from '@ncigdc/utils/withControlledAccess';
import setupStore from '@ncigdc/dux';
import { fetchApiVersionInfo } from '@ncigdc/dux/versionInfo';
import { viewerQuery } from '@ncigdc/routes/queries';
import { fetchUser } from '@ncigdc/dux/auth';
import Login from '@ncigdc/routes/Login';
import { redirectToLogin } from '@ncigdc/utils/auth';
import consoleDebug from '@ncigdc/utils/consoleDebug';
import { fetchNotifications } from '@ncigdc/dux/bannerNotification';
import Loader from '@ncigdc/uikit/Loaders/Loader';
import {
  API,
  AWG,
  DISPLAY_DAVE_CA,
  IS_AUTH_PORTAL,
  IS_DEV,
} from '@ncigdc/utils/constants';

import Portal from './Portal';

// if (process.env.NODE_ENV !== 'production') {
//   const { whyDidYouUpdate } = require('why-did-you-update');
//   whyDidYouUpdate(React);
// }

const retryStatusCodes = [
  500,
  503,
  504,
];

const AccessError = message => {
  const instance = new Error(message);
  instance.name = 'AccessError';
  return instance;
};

export const { persistor, store } = setupStore({
  persistConfig: {
    keyPrefix: 'ncigdcActive',
  },
});

window.store = store;

store.dispatch(fetchApiVersionInfo());

if (!IS_DEV) {
  store.dispatch(fetchUser());
  if (!AWG) {
    store.dispatch(fetchNotifications());
  }
}

class RelayRoute extends Relay.Route {
  static routeName = 'RootRoute';

  static queries = viewerQuery;
}

const HasUser = connect(state => state.auth)(props => {
  return props.children({
    error: props.error,
    failed: props.failed,
    user: props.user,
  });
});

const RelaySetup = compose(
  setDisplayName('EnhancedRelayRootRoute'),
  withControlledAccessContext,
  withHandlers({
    customMiddleware: ({
      controlledAccessProps: {
        controlledStudiesQueryParam,
      } = {},
      useStudyParam,
    }) => next => req => {
      const [url, search = ''] = req.url.split('?');
      const hash =
        parse(search).hash ||
        md5(
          [req.relayReqObj._printedQuery.text, JSON.stringify(req.relayReqObj._printedQuery.variables)].join(':'),
        );

      req.url = `${url}?hash=${hash}`;

      const parsedBody = JSON.parse(req.body);
      req.body = JSON.stringify({
        ...parsedBody,
        ...(!IS_DEV &&
          DISPLAY_DAVE_CA &&
          useStudyParam &&
          controlledStudiesQueryParam)
          ? { study: controlledStudiesQueryParam }
          : {},
      });

      if (!IS_AUTH_PORTAL) {
        return next(req);
      }

      req.credentials = 'include';

      return next(req)
        .then(res => {
          if (!res.ok && !retryStatusCodes.includes(res.status)) {
            consoleDebug('Throwing error in Root');
            throw res;
          }

          const { json } = res;
          const { user } = window.store.getState().auth;

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
          const { user } = window.store.getState().auth;
          if (err.name === 'AccessError') {
            consoleDebug(`Access error message: ${err.message}`);
            return redirectToLogin(err.message);
          }
          consoleDebug(`Something went wrong in Root network layer: ${err}`);
            // not able to pass the response status from throw so need to exclude by error message
          const errorMessage = err.message
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
        });
    },
  }),
  lifecycle({
    componentDidMount() {
      const {
        customMiddleware,
      } = this.props;

      Relay.injectNetworkLayer(
        new RelayNetworkLayer([
          urlMiddleware({
            url: () => urlJoin(API, 'graphql'),
          }),
          retryMiddleware({
            fetchTimeout: 15000,
            forceRetry: (cb, delay) => {
              window.forceRelayRetry = cb;
              console.log(
                `call \`forceRelayRetry()\` for immediately retry! Or wait ${delay} ms.`,
              );
            },
            retryDelays: attempt => ((attempt + 4) ** 2) * 100,
            statusCodes: retryStatusCodes,
          }),
          customMiddleware,
        ]),
      );
    },
  }),
)(props => (
  IS_AUTH_PORTAL
    ? (
      <Switch>
        <Route component={Login} exact path="/login" />
        <Route
          render={routeProps => (
            <HasUser>
              {({ error, failed, user }) => {
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
                      environment={Relay.Store}
                      queryConfig={new RelayRoute(routeProps)}
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
    ) : (
      <Relay.Renderer
        Container={Portal}
        environment={Relay.Store}
        queryConfig={new RelayRoute(props)}
        />
    )
));

const Root = (rootProps: mixed) => (
  <Provider store={store}>
    <PersistGate loading={<Loader />} persistor={persistor}>
      <Router>
        <RelaySetup {...rootProps} />
      </Router>
    </PersistGate>
  </Provider>
);

export default Root;
