// @flow

import urlJoin from 'url-join';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import md5 from 'blueimp-md5';
import { API } from '@ncigdc/utils/constants';

const source = new RecordSource();
const store = new Store(source);
const simpleCache = {};
const pendingCache = {};
const handlerProvider = null;

function fetchQuery(operation, variables, cacheConfig) {
  const body = JSON.stringify({
    query: operation.text, // GraphQL text from input
    variables,
  });
  const hash = md5(body);
  const [componentName] = operation.name.split('_relayQuery');
  // checks if there is a request for the current hash in the pendingCache
  if (pendingCache[hash]) {
    return new Promise((res, rej) => {
      // if that request already exists in the pendingCache, set a timeout interval that will check every 100ms to see if there is a value in the simpleCache
      // this will prevent the same request being executed when there is already a fetch request in progress
      const id = setInterval(() => {
        // set a timer here at the beginning of the setInterval to track how long one request has been checking the simpleCache
        let timer = 0;
        // once the request hash is found in the simpleCache stop the interval from running and resolve the promise with the value for the current hash
        if (simpleCache[hash]) {
          clearInterval(id);
          res(simpleCache[hash]);
        }
        // if the timer has reach 10s, the pending request has taken too long and the promise return an error
        // stop the interval and delete the current hash value from pending so it can be attempted again
        if (timer > 10000) {
          clearInterval(id);
          delete pendingCache[hash];
          rej(`Error: ${componentName} was pending for too long.`);
        }
        // increment the timer to track how long the request is pending
        timer += 100;
      }, 100);
    });
  }
  // if the current request hash is already in the simpleCache, resolve with that value. Current request can use the cached result, won't need to proceed to fetch
  if (simpleCache[hash]) {
    return Promise.resolve(simpleCache[hash]);
  }
  // if the request is not in the simpleCache yet, put it in the pendingCache and proceed to fetch
  pendingCache[hash] = true;

  return fetch(urlJoin(API, `graphql/${componentName}?hash=${hash}`), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body,
  }).then(response =>
    response.json().then(json => {
      if (response.status === 200) {
        // if the response is ok, and the result to the simpleCache and delete it from the pendingCache
        simpleCache[hash] = json;
        delete pendingCache[hash];
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
