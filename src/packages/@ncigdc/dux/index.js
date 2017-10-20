// @flow
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
import { apiMiddleware } from 'redux-api-middleware';
import reducers from './reducers';

type TSetupStoreArgs = {
  persistConfig: Object,
};
type TSetupStore = (args: TSetupStoreArgs) => Object;
const setupStore: TSetupStore = ({ persistConfig = {} } = {}) => {
  const store = createStore(
    combineReducers(reducers),
    applyMiddleware(thunk, apiMiddleware),
  );

  persistStore(store, {
    whitelist: [
      'auth',
      'cart',
      'tableColumns',
      'customFacets',
      'sets',
      'analysis',
    ],
    ...persistConfig,
  });

  return store;
};

export default setupStore;
