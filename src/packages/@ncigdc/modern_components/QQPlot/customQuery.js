import md5 from 'blueimp-md5';
import urlJoin from 'url-join';

import consoleDebug from '@ncigdc/utils/consoleDebug';
import { redirectToLogin } from '@ncigdc/utils/auth';

import { API, IS_AUTH_PORTAL } from '@ncigdc/utils/constants';
import { fetchApi } from '@ncigdc/utils/ajax';

const customQueryCache = {};
const pendingCustomQueryCache = {};

export default ({
  query,
  variables,
  queryName,
  fieldName,
}) => {
  const body = JSON.stringify({
    query,
    variables,
  });

  const hash = md5(body);

  if (pendingCustomQueryCache[hash]) {
    return new Promise((res, rej) => {
      const id = setInterval(() => {
        let timer = 0;
        if (customQueryCache[hash]) {
          clearInterval(id);
          res(customQueryCache[hash]);
        }

        if (timer > 10000) {
          clearInterval(id);
          delete pendingCustomQueryCache[hash];
          rej(`Error: ${queryName} was pending for too long.`);
        }
        timer += 100;
      }, 100);
    });
  }

  if (customQueryCache[hash]) {
    return Promise.resolve(customQueryCache[hash]);
  }
  pendingCustomQueryCache[hash] = true;
  // return fetchApi(
  //   `analysis/top_mutated_genes_by_project?size=${size}&fields=${fields.join()}${filters
  //     .content.length
  //     ? `&filters=${JSON.stringify(filters)}`
  //     : ''}`,
  // );

//   return fetch(
//     urlJoin(API, `graphql/${queryName}?hash=${hash}`),
//     {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body,
//     }
//   )

  return fetchApi('case_ssms', {
    headers: { 'Content-Type': 'application/json' },
    body: {
      filters: JSON.stringify(variables.filters_1),
      size: variables.first,
      fields: fieldName,
    },
  }).then(json => {
        // if (!response.ok) {
        //   consoleDebug('throwing error in Custom Query');
        //   throw response;
        // }

      // if (response.status === 200) {
      //   customQueryCache[hash] = json;
      //   delete pendingCustomQueryCache[hash];
      // }

    return json;
  })
    .catch(err => {
      if (err.status) {
        switch (err.status) {
          case 401:
          case 403:
            consoleDebug(err.statusText);
            if (IS_AUTH_PORTAL) {
              return redirectToLogin('timeout');
            }
            break;
          case 400:
          case 404:
            consoleDebug(err.statusText);
            break;
          default:
            return consoleDebug(`Default error case: ${err.statusText}`);
        }
      } else {
        consoleDebug(
          `Something went wrong in environment, but no error status: ${err}`
        );
      }
    });
};
