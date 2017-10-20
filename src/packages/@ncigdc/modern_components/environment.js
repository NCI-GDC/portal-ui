// @flow

import urlJoin from 'url-join';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import md5 from 'blueimp-md5';
import { API } from '@ncigdc/utils/constants';

const source = new RecordSource();
const store = new Store(source);
const simpleCache = {};
const handlerProvider = null;

function fetchQuery(operation, variables, cacheConfig) {
  // for demo purposes
  const { store } = require('../../../Portal');

  const { auth } = store.getState();

  const body = JSON.stringify({
    project_ids: auth.project_ids,
    query: operation.text, // GraphQL text from input
    variables,
  });

  const hash = md5(body);
  const [componentName] = operation.name.split('_relayQuery');

  /* disable cache for demo */
  // if (simpleCache[hash]) {
  //   return Promise.resolve(simpleCache[hash]);
  // }

  return fetch(urlJoin(API, `graphql/${componentName}?hash=${hash}`), {
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
