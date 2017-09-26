// @flow

import urlJoin from 'url-join';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import md5 from 'blueimp-md5';
import { setLoader, removeLoader } from '@ncigdc/dux/loaders';
import { API } from '@ncigdc/utils/constants';

const source = new RecordSource();
const store = new Store(source);
const handlerProvider = null;

function fetchQuery(operation, variables, cacheConfig, uploadables) {
  const reduxStore = process.env.NODE_ENV === 'test'
    ? { dispatch: x => x }
    : require('../../../Portal').store;

  const body = JSON.stringify({
    query: operation.text, // GraphQL text from input
    variables,
  });

  const hash = md5(body);

  const [componentName] = operation.name.split('_relayQuery');

  setTimeout(() => reduxStore.dispatch(setLoader(componentName)));

  return fetch(urlJoin(API, `graphql/${componentName}?hash=${hash}`), {
    method: 'POST',
    headers: {
      // Add authentication and other headers here
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables,
    }),
  }).then(response => {
    setTimeout(() => reduxStore.dispatch(removeLoader(componentName)));
    return response.json();
  });
}

// Create a network layer from the fetch function
const network = Network.create(fetchQuery);

export default new Environment({
  handlerProvider, // Can omit.
  network,
  store,
});
