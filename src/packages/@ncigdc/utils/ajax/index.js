// @flow
import { RSAA } from 'redux-api-middleware';
import urlJoin from 'url-join';
import Queue from 'queue';
import md5 from 'blueimp-md5';

import {
  API,
  AUTH,
  IS_AUTH_PORTAL,
} from '@ncigdc/utils/constants';
import { redirectToLogin } from '@ncigdc/utils/auth';
import { checkAWGSession } from '@ncigdc/utils/auth/awg';
import consoleDebug from '@ncigdc/utils/consoleDebug';

const DEFAULTS = {
  credentials: 'same-origin',
  headers: {
    'Access-Control-Allow-Origin': true,
    'Content-Type': 'application/json',
    'X-Auth-Token': 'secret admin token',
  },
  method: 'get',
};

export function fetchAuth(options: { endpoint: string }): Object {
  return {
    [RSAA]: {
      ...DEFAULTS,
      ...(IS_AUTH_PORTAL
        ? {
          credentials: 'include',
          headers: {},
        }
        : {}),
      ...options,
      endpoint: urlJoin(AUTH, options.endpoint),
    },
  };
}

// $FlowIgnore
export const fetchApi = async (endpoint, options = {}) => {
  /* This helper was originally designed to return the JSON of all requests by default.
   * This is not what we want in the case of file streams, etc.
   *
   * Made that optional instead using "fullResponse", destructuring it like so,
   * in order to avoid TS issues and ensure backwards compatibility.
   */
  const {
    fullResponse = false,
    ...opts
  } = options;

  const clonedOptions = {
    ...opts,
    ...(IS_AUTH_PORTAL
      ? {
        credentials: opts.credentials || 'include',
        headers: opts.headers,
      }
      : {}),
    ...(opts.body && {
      body: JSON.stringify(opts.body),
      method: 'POST',
    }),
  };

  const sessionActive = IS_AUTH_PORTAL ? await checkAWGSession('fetchAPI-triggered', endpoint) : true;

  return sessionActive
    ? fetch(urlJoin(API, endpoint), clonedOptions)
      .then(r => {
        if (r.ok) {
          return fullResponse ? r : r.json();
        }

        throw r;
      })
      .catch(err => {
        if (err.status) {
          switch (err.status) {
            case 401:
            case 403:
              consoleDebug(err.statusText);
              return IS_AUTH_PORTAL && redirectToLogin('timeout');
            case 400:
            case 404:
            case 500:
              return consoleDebug(err.statusText);
            default:
              return consoleDebug(`there was an error ${err.statusText}`);
          }
        } else {
          consoleDebug('Something went wrong');
        }
      })
    : (
      redirectToLogin('timeout'),
      {}
    );
};

type TFetchApiChunked = (
  endpoint: string,
  opts: { chunkSize?: number }
) => Promise<{ data: { hits: Array<{}> } }>;
const DEFAULT_CHUNK_SIZE = 10000;
export const fetchApiChunked: TFetchApiChunked = async (
  endpoint,
  { chunkSize = DEFAULT_CHUNK_SIZE, ...opts } = {},
) => {
  const queue = Queue({ concurrency: 6 });
  const body = opts.body || {};
  const firstSize = body.size < chunkSize ? body.size : 0;

  const defaultOptions = {
    ...opts,
    body: {
      ...body,
      sort: body.sort || '_uid', // force consistent order
      from: 0,
      size: firstSize,
    },
  };
  const hash = md5(JSON.stringify(defaultOptions));
  const { data } = await fetchApi(
    urlJoin(endpoint, `?hash=${hash}`),
    defaultOptions,
  );
  let { hits } = data;

  for (
    let count = firstSize;
    count < data.pagination.total;
    count += chunkSize
  ) {
    // eslint-disable-next-line no-loop-func
    queue.push(callback => {
      const options = {
        ...defaultOptions,
        body: {
          ...defaultOptions.body,
          from: count,
          size: chunkSize,
        },
      };
      const newHash = md5(JSON.stringify(options));
      fetchApi(urlJoin(endpoint, `?hash=${newHash}`), options).then(response => {
        hits = [...hits, ...response.data.hits];
        callback();
      });
    });
  }

  return new Promise((resolve, reject) => {
    queue.start(err => {
      if (err) {
        reject(err);
      } else {
        resolve({ data: { hits } });
      }
    });
  });
};
