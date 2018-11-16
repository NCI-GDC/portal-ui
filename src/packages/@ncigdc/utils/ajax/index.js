// @flow
import { CALL_API } from 'redux-api-middleware';
import urlJoin from 'url-join';
import Queue from 'queue';
import md5 from 'blueimp-md5';

import { API, AUTH, IS_AUTH_PORTAL } from '@ncigdc/utils/constants';
import { redirectToLogin } from '@ncigdc/utils/auth';

const DEFAULTS = {
  method: 'get',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': true,
    'X-Auth-Token': 'secret admin token',
  },
};

export function fetchAuth(options: { endpoint: string }): Object {
  return {
    [CALL_API]: {
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
export const fetchApi = (endpoint, opts = {}) => {
  const clonedOptions = {
    ...opts,
    ...(opts.body && {
      body: JSON.stringify(opts.body),
      method: 'POST',
    }),
  };
  return fetch(urlJoin(API, endpoint), clonedOptions)
    .then(r => {
      if (!r.ok) {
        throw new Error('network response not ok');
      }
      return r.json();
    })
    .catch(err => {
      console.log('fetch error: ', err);
      if (IS_AUTH_PORTAL) {
        return redirectToLogin();
      }
    });
};

type TFetchApiChunked = (
  endpoint: string,
  opts: { chunkSize?: number },
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
  let hits = data.hits;

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
      const hash = md5(JSON.stringify(options));
      fetchApi(urlJoin(endpoint, `?hash=${hash}`), options).then(response => {
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
