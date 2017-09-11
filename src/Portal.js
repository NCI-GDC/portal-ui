/* @flow */

import '@ncigdc/theme/global.css';
import React from 'react';
import Relay from 'react-relay/classic';
import { Provider } from 'react-redux';
import setupStore from '@ncigdc/dux';
import { fetchApiVersionInfo } from '@ncigdc/dux/versionInfo';
import { fetchNotifications } from '@ncigdc/dux/bannerNotification';
import { fetchUser } from '@ncigdc/dux/auth';
import PortalContainer from '@ncigdc/components/PortalContainer';
import { BrowserRouter as Router } from 'react-router-dom';

export const store = setupStore({
  persistConfig: {
    keyPrefix: 'ncigdcActive',
  },
});

store.dispatch(fetchApiVersionInfo());

if (process.env.NODE_ENV !== 'development') {
  store.dispatch(fetchNotifications());
  store.dispatch(fetchUser());
}

const PortalComponent = () =>
  <Provider store={store}>
    <Router>
      <PortalContainer />
    </Router>
  </Provider>;

const PortalQuery = {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        user {
          username
        }
      }
    `,
  },
};

const Portal = Relay.createContainer(PortalComponent, PortalQuery);

export default Portal;
