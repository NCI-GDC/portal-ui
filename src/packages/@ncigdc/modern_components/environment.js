// @flow

import urlJoin from 'url-join';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { setLoader, removeLoader } from '@ncigdc/dux/loaders';
import { store as reduxStore } from '../../../Portal';

const source = new RecordSource();
const store = new Store(source);
const handlerProvider = null;

function fetchQuery(operation, variables, cacheConfig, uploadables) {
  const [componentName] = operation.name.split('_relayQuery');
  reduxStore.dispatch(setLoader(componentName));

  return fetch(urlJoin(process.env.REACT_APP_API, 'graphql'), {
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
    reduxStore.dispatch(removeLoader(componentName));
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
