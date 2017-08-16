// @flow

import urlJoin from 'url-join';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import md5 from 'blueimp-md5';

const source = new RecordSource();
const store = new Store(source);
const handlerProvider = null;

function fetchQuery(operation, variables, cacheConfig) {
  const body = JSON.stringify({
    query: operation.text, // GraphQL text from input
    variables,
  });

  const hash = md5(body);

  const [componentName] = operation.name.split('_relayQuery');

  return fetch(
    urlJoin(process.env.REACT_APP_API, `graphql/${componentName}?hash=${hash}`),
    {
      method: 'POST',
      headers: {
        // Add authentication and other headers here
        'content-type': 'application/json',
      },
      body,
    },
  ).then(response => {
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
