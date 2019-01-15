// @flow
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import {
  persistStore,
  persistReducer,
  persistCombineReducers,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
// import { REHYDRATE } from 'redux-persist/lib/constants';

import { apiMiddleware } from 'redux-api-middleware';
import reducers from './reducers';

type TSetupStoreArgs = {
  persistConfig: Object,
};
type TSetupStore = (args: TSetupStoreArgs) => Object;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const setupStore: TSetupStore = ({ persistConfig = {} } = {}) => {
  const config = {
    key: 'reducers',
    storage: storage,
    stateReconciler: autoMergeLevel2,
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
  };

  const pReducer = persistReducer(config, combineReducers(reducers));
  const store = createStore(
    pReducer,
    composeEnhancers(applyMiddleware(thunk, apiMiddleware)),
  );

  const persistor = persistStore(store);

  return { store, persistor };
};

export default setupStore;
