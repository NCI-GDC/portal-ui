// @flow

import urlJoin from 'url-join';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import md5 from 'blueimp-md5';
import { REACT_APP_GRAPHQL } from '@ncigdc/utils/constants';

const source = new RecordSource();
const store = new Store(source);
const simpleCache = {};
const handlerProvider = null;

function fetchQuery(operation, variables, cacheConfig) {
  const body = JSON.stringify({
    query: operation.text, // GraphQL text from input
    variables,
  });

  const hash = md5(body);
  const [componentName] = operation.name.split('_relayQuery');

  if (simpleCache[hash]) {
    return Promise.resolve(simpleCache[hash]);
  }

  return fetch(urlJoin(REACT_APP_GRAPHQL, `/${componentName}?hash=${hash}`), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body,
  }).then(response =>
    response.json().then(json => {
      if (response.status === 200) {
        simpleCache[hash] = json;
      }

      return json;
    }),
  );
}

// Create a network layer from the fetch function
const network = Network.create(fetchQuery);

export default new Environment({
  handlerProvider, // Can omit.
  network,
  store,
});
