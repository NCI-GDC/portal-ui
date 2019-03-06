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
import Loader from '@ncigdc/uikit/Loaders/Loader';

import { API } from '@ncigdc/utils/constants';

const DEFAULT_CONTINUOUS_BUCKETS = 5;

const continuousAggregationQuery = ({ fieldName, stats, filters }) => {
  const interval = (stats.max - stats.min) / DEFAULT_CONTINUOUS_BUCKETS;
  const queryFieldName = fieldName.replace('.', '__');

  const variables = {
    filters,
  };

  const body = JSON.stringify({
    query: `query ContinuousAggregationQuery(\n  $filters: FiltersArgument\n) {\n  viewer {\n    explore {\n      cases {\n        aggregations(filters: $filters) {\n          ${queryFieldName} {\n            histogram(interval: ${interval}) {\n              buckets {\n                key\n                doc_count\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n`,
    variables,
  });

  const hash = md5(body);

  return fetch(
    urlJoin(API, `graphql/ContinuousAggregationQuery?hash=${hash}`),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    }
  )
    .then(res => res.json())
    .then(data => data)
    .catch(err => {
      console.log('Error:', err);
      return { data: null };
    });
};

export default compose(
  withState('aggData', 'setAggData', null),
  withState('isLoading', 'setIsLoading', true),
  lifecycle({
    async componentDidMount() {
      const {
        fieldName,
        stats,
        filters,
        setAggData,
        setIsLoading,
      } = this.props;
      const res = await continuousAggregationQuery({
        fieldName,
        stats,
        filters,
      });
      setAggData(res.data.viewer);
      setIsLoading(false);
    },
  })
)(({ aggData, isLoading, ...props }) => {
  if (isLoading) {
    return <Loader />;
  }
  return <ClinicalVariableCard viewer={aggData} {...props} />;
});
