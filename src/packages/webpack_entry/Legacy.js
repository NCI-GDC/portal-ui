/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import Match from 'react-router';
import Redirect from 'react-router/Redirect';

import '@ncigdc/theme/global.css';

import { Provider } from 'react-redux';

import setupStore from '@ncigdc/dux';
import { fetchApiVersionInfo } from '@ncigdc/dux/versionInfo';

import FilesRoute from '@ncigdc/routes/legacy/FilesRoute';
import AnnotationsRoute from '@ncigdc/routes/AnnotationsRoute';
import CartRoute from '@ncigdc/routes/CartRoute';
import FileRoute from '@ncigdc/routes/FileRoute';
import AnnotationRoute from '@ncigdc/routes/AnnotationRoute';

import Header from '@ncigdc/components/Legacy/Header';
import Footer from '@ncigdc/components/Footer';
import NotificationContainer from '@ncigdc/components/NotificationContainer';

const store = setupStore({
  persistConfig: {
    keyPrefix: 'ncigdcLegacy',
  },
});

store.dispatch(fetchApiVersionInfo());

const LegacyComponent = () => (
  <Provider store={store}>
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Header />
      <div style={{ paddingBottom: '200px' }}>
        <Match pattern="/" exactly render={() => <Redirect to="/files" />} />
        <Match exactly pattern="/cart" component={CartRoute} />
        <Match exactly pattern="/files" component={FilesRoute} />
        <Match exactly pattern="/annotations" component={AnnotationsRoute} />
        <Match pattern="/files/:id" component={FileRoute} />
        <Match pattern="/annotations/:id" component={AnnotationRoute} />
      </div>
      <Footer />
      <NotificationContainer />
    </div>
  </Provider>
);

const LegacyQuery = {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        summary {
          aggregations {
            access {
              buckets {
                doc_count
              }
            }
          }
        }
      }
    `,
  },
};

const Legacy = Relay.createContainer(
  LegacyComponent,
  LegacyQuery
);

export default Legacy;
