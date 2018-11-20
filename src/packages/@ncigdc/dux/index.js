// @flow
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
import createActionBuffer from 'redux-action-buffer';
import { REHYDRATE } from 'redux-persist/constants';

import { apiMiddleware } from 'redux-api-middleware';
import reducers from './reducers';

type TSetupStoreArgs = {
  persistConfig: Object,
};
type TSetupStore = (args: TSetupStoreArgs) => Object;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const setupStore: TSetupStore = ({ persistConfig = {} } = {}) => {
  const store = createStore(
    combineReducers(reducers),
    composeEnhancers(applyMiddleware(thunk, apiMiddleware)),
  );

  persistStore(store, {
    whitelist: [
      'cart',
      'tableColumns',
      'customFacets',
      'sets',
      'analysis',
      'bannerNotification',
      'auth',
    ],
    ...persistConfig,
  });

  return store;
};

export default setupStore;
