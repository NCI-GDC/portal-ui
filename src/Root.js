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
import {
  compose,
  lifecycle,
  setDisplayName,
  withHandlers,
} from 'recompose';

import setupStore from '@ncigdc/dux';
import { fetchApiVersionInfo } from '@ncigdc/dux/versionInfo';
import { viewerQuery } from '@ncigdc/routes/queries';
import { fetchUser } from '@ncigdc/dux/auth';
import Login from '@ncigdc/routes/Login';
import { redirectToLogin } from '@ncigdc/utils/auth';
import {
  checkAWGSession,
  clearAWGSession,
  keepAliveAWGSession,
} from '@ncigdc/utils/auth/awg';
import consoleDebug from '@ncigdc/utils/consoleDebug';
import { fetchNotifications } from '@ncigdc/dux/bannerNotification';
import Loader from '@ncigdc/uikit/Loaders/Loader';
import {
  API,
  AWG,
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

if (!(IS_DEV || AWG)) {
  store.dispatch(fetchUser());
  store.dispatch(fetchNotifications());
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
  withHandlers({
    customMiddleware: () => next => async req => {
      const [url, search = ''] = req.url.split('?');
      const hash =
        parse(search).hash ||
        md5(
          [req.relayReqObj._printedQuery.text, JSON.stringify(req.relayReqObj._printedQuery.variables)].join(':'),
        );

      req.url = `${url}?hash=${hash}`;

      const parsedBody = JSON.parse(req.body);
      req.body = JSON.stringify(parsedBody);

      if (IS_AUTH_PORTAL) {
        req.credentials = 'include';

        // resolves always true when !AWG
        const sessionActive = await checkAWGSession('classicRelay-triggered', req.body);

        return sessionActive
          ? next(req)
            .then(response => {
              const { payload } = response;
              const { user } = window.store.getState().auth;

              if (user) {
                if (!payload.fence_projects[0]) {
                  throw new AccessError('no_fence_projects');
                }

                if (!payload.nih_projects) {
                  throw new AccessError('no_nih_projects');
                }

                if (!payload.intersection[0]) {
                  throw new AccessError('no_intersection');
                }
              }

              return response;
            })
            .catch(err => {
              const { user } = window.store.getState().auth;
              if (err.name === 'AccessError') {
                consoleDebug(`Access error message: ${err.message}`);
                return redirectToLogin(err.message);
              }
              consoleDebug('Something went wrong in Root network layer:');
              consoleDebug(err);
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
            })
          : redirectToLogin('timeout'); // this is AWG only
      }

      // TODO add error handling.
      return next(req);
    },
  }),
  lifecycle({
    componentDidMount() {
      const {
        customMiddleware,
      } = this.props;

      if (IS_AUTH_PORTAL) {
        // only enabled if AWG_TOKEN_RENEWAL_INTERVAL is set
        this.AWGSessionTimer = keepAliveAWGSession();
      }

      Relay.injectNetworkLayer(
        new RelayNetworkLayer([
          urlMiddleware({
            url: () => urlJoin(API, 'graphql'),
          }),
          retryMiddleware({
            fetchTimeout: 15000,
            forceRetry: (cb, delay) => {
              window.forceRelayRetry = cb;
              console.info(
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
    componentWillUnmount() {
      // only active if AWG_TOKEN_RENEWAL_INTERVAL is set
      IS_AUTH_PORTAL && clearAWGSession(this.AWGSessionTimer);
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
                if (failed) {
                  consoleDebug('Root component user: ', user);

                  if (error.message === 'Session timed out or not authorized') {
                    consoleDebug('User request failed with error message');
                    return <Redirect to="/login?error=timeout" />;
                  }

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

                consoleDebug('Response does not match any criteria, redirecting to login');
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
