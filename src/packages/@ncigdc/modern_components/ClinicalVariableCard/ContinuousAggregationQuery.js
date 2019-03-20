import React from 'react';
import {
  compose,
  withPropsOnChange,
  branch,
  renderComponent,
  withProps,
  withState,
  lifecycle,
} from 'recompose';
import md5 from 'blueimp-md5';
import urlJoin from 'url-join';
import _ from 'lodash';

import ClinicalVariableCard from '@ncigdc/modern_components/ClinicalVariableCard/ClinicalVariableCard.js';
import consoleDebug from '@ncigdc/utils/consoleDebug';
import { redirectToLogin } from '@ncigdc/utils/auth';
import { withLoader } from '@ncigdc/uikit/Loaders/Loader';
import Loader from '@ncigdc/uikit/Loaders/Loader';

import { API, IS_AUTH_PORTAL } from '@ncigdc/utils/constants';

const simpleAggCache = {};
const pendingAggCache = {};
const DEFAULT_CONTINUOUS_BUCKETS = 4;

const getContinuousAggs = ({ fieldName, stats, filters }) => {
  // prevent query failing if interval will equal 0
  if (_.isNull(stats.min) || _.isNull(stats.max)) {
    return null;
  }
  const interval = (stats.max - stats.min) / DEFAULT_CONTINUOUS_BUCKETS;
  const queryFieldName = fieldName.replace('.', '__');

  const variables = {
    filters,
  };
  const componentName = 'ContinuousAggregationQuery';
  const body = JSON.stringify({
    query: `query ${componentName}(\n  $filters: FiltersArgument\n) {\n  viewer {\n    explore {\n      cases {\n        aggregations(filters: $filters) {\n          ${queryFieldName} {\n            histogram(interval: ${interval}) {\n              buckets {\n                key\n                doc_count\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n`,
    variables,
  });

  const hash = md5(body);

  if (pendingAggCache[hash]) {
    return new Promise((res, rej) => {
      const id = setInterval(() => {
        let timer = 0;
        if (simpleAggCache[hash]) {
          clearInterval(id);
          res(simpleAggCache[hash]);
        }

        if (timer > 10000) {
          clearInterval(id);
          delete pendingAggCache[hash];
          rej(`Error: ${componentName} was pending for too long.`);
        }
        timer += 100;
      }, 100);
    });
  }

  if (simpleAggCache[hash]) {
    return Promise.resolve(simpleAggCache[hash]);
  }
  pendingAggCache[hash] = true;
  return fetch(
    urlJoin(API, `graphql/ContinuousAggregationQuery?hash=${hash}`),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    }
  ).then(response =>
    response
      .json()
      .then(json => {
        if (!response.ok) {
          consoleDebug('throwing error in Environment');
          throw response;
        }

        if (response.status === 200) {
          simpleAggCache[hash] = json;
          delete pendingAggCache[hash];
        }

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
      })
  );
};

export default compose(
  withState('aggData', 'setAggData', null),
  withState('isLoading', 'setIsLoading', true),
  withProps({
    updateData: async ({
      fieldName,
      stats,
      filters,
      aggData,
      setAggData,
      setIsLoading,
    }) => {
      const res = await getContinuousAggs({
        fieldName,
        stats,
        filters,
      });
      setAggData(res && res.data.viewer, () => setIsLoading(false));
    },
  }),
  withPropsOnChange(['filters'], ({ updateData, ...props }) =>
    updateData(props)
  )
)(({ aggData, isLoading, setId, stats, viewer, ...props }) => {
  if (isLoading) {
    return <Loader />;
  }
  return (
    <ClinicalVariableCard
      aggData={aggData}
      loading={isLoading}
      setId={setId}
      stats={stats}
      viewer={viewer}
      {...props}
    />
  );
});
