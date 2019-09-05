import React from 'react';
import {
  compose,
  setDisplayName,
  withPropsOnChange,
  withProps,
  withState,
} from 'recompose';
import md5 from 'blueimp-md5';
import urlJoin from 'url-join';
import {
  isEqual,
  isNull,
  reduce,
} from 'lodash';

import Loader from '@ncigdc/uikit/Loaders/Loader';
import { redirectToLogin } from '@ncigdc/utils/auth';
import consoleDebug from '@ncigdc/utils/consoleDebug';
import { API, IS_AUTH_PORTAL } from '@ncigdc/utils/constants';
import { createFacetFieldString } from '@ncigdc/utils/string';

import { ContinuousVariableCard } from './ClinicalVariableCard';
import { parseContinuousKey } from './ClinicalVariableCard/helpers';

const simpleAggCache = {};
const pendingAggCache = {};
const DEFAULT_CONTINUOUS_BUCKETS = 5;

const getContinuousAggs = ({
  bins,
  continuousBinType,
  fieldName,
  filters,
  stats,
}) => {
  // prevent query failing if interval will equal 0
  if (isNull(stats.min) || isNull(stats.max)) {
    return null;
  }

  const interval = (stats.max - stats.min) / DEFAULT_CONTINUOUS_BUCKETS;

  const makeDefaultBuckets = () => Array(DEFAULT_CONTINUOUS_BUCKETS)
    .fill(1).map(
      (val, key) => ({
        from: key * interval + stats.min,
        to: (key + 1) === DEFAULT_CONTINUOUS_BUCKETS
          ? stats.max + 1
          // api excludes max value
          : stats.min + (key + 1) * interval,
      })
    );

  let rangeArr = continuousBinType === 'default'
    ? makeDefaultBuckets()
    : reduce(bins, (acc, bin) => {
      const binValues = parseContinuousKey(bin.key);
      const [from, to] = binValues;
      if (
        !!bin &&
        (typeof from === 'number') &&
        (typeof to === 'number') &&
        (from < to)
      ) {
        const result = [
          ...acc,
          {
            from,
            to,
          },
        ];
        return result;
      }
      return acc;
    }, []);

  if (rangeArr.length === 0) {
    rangeArr = makeDefaultBuckets();
  }

  const filters2 = {
    content: [
      {
        ranges: rangeArr,
      },
    ],
    op: 'range',
  };
  const aggregationFieldName = createFacetFieldString(fieldName);

  const variables = {
    filters,
    filters2,
  };
  const componentName = 'ContinuousAggregationQuery';
  const body = JSON.stringify({
    query: `query ${componentName}($filters: FiltersArgument, $filters2: FiltersArgument) {
      viewer {
        explore {
          cases {
            aggregations(filters: $filters) {
              ${aggregationFieldName} {
                stats {
                  Min : min
                  Max: max
                  Mean: avg
                  SD: std_deviation
                }
                percentiles {
                  Median: median
                  IQR: iqr
                  q1: quartile_1
                  q3: quartile_3
                }
                range(ranges: $filters2) {
                  buckets {
                    doc_count
                    key
                  }
                }
              }
            }
          }
        }
      }
    }`,
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
      body,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    }
  ).then(response => response
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
          `Something went wrong in the environment, but no error status: ${err}`
        );
      }
    }));
};

const ContinuousAggregationQuery = ({
  aggData,
  hits,
  isLoading,
  setId,
  stats,
  ...props
}) => ( // TODO this loader doesn't belong here. Must fix the continuous variable card dependency
  isLoading
  ? <Loader />
  : (
    <ContinuousVariableCard
      data={{
        ...aggData,
        hits,
      }}
      setId={setId}
      stats={stats}
      {...props}
      />
    )
);

export default compose(
  setDisplayName('EnhancedContinuousAggregationQuery'),
  withState('aggData', 'setAggData', null),
  withState('isLoading', 'setIsLoading', true),
  withProps({
    updateData: async ({
      fieldName,
      filters,
      hits,
      setAggData,
      setIsLoading,
      stats,
      variable,
    }) => {
      const res = await getContinuousAggs({
        bins: variable.bins,
        continuousBinType: variable.continuousBinType,
        fieldName,
        filters,
        hits,
        stats,
      });
      setAggData(res && res.data.viewer, () => setIsLoading(false));
    },
  }),
  withPropsOnChange(
    ({ filters }, { filters: nextFilters }) => !(
      isEqual(nextFilters, filters)
    ), ({
      updateData,
      ...props
    }) => {
      updateData(props);
    }
  ),
)(ContinuousAggregationQuery);
