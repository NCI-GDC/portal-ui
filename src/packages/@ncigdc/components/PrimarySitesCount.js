// @flow

import React from 'react';

import type { TBucket } from '@ncigdc/components/Aggregations/types';

export type TProps = {
  aggregations: {
    primary_site: { buckets: [TBucket] },
  },
};

const PrimarySitesCount = (props: TProps) =>
  <span data-test="primary-sites-count">
    {props.aggregations.primary_site.buckets.length > 0
      ? props.aggregations.primary_site.buckets.length.toLocaleString()
      : <span className="fa fa-spinner fa-spin" />}
  </span>;

export default PrimarySitesCount;
