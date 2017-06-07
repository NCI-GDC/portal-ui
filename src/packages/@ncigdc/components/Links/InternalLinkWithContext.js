/* @flow */

import React from 'react';
import _ from 'lodash';
import LocationSubscriber from '@ncigdc/components/LocationSubscriber';

import { mergeQuery as mq } from '@ncigdc/utils/filters';

import type { TRawQuery } from '@ncigdc/utils/uri/types';

import InternalLink from './InternalLink';

import type { TLinkProps } from './types';

const InternalLinkWithContext = ({
  pathname,
  query,
  merge,
  mergeQuery,
  whitelist,
  ...rest
}: TLinkProps) => (
  <LocationSubscriber>
    {(ctx: {| pathname: string, query: TRawQuery |}) => {
      const pn = pathname || ctx.pathname;

      const mergedQuery = merge && mergeQuery
        ? mergeQuery(query, ctx.query, merge, whitelist)
        : query;

      const hasFilterChanged = _.some([
        // Note: empty {} passed in b/c
        // mergeQuery(ctx.query).filters is a jsurl string
        // mergeQuery({}, ctx.query).filters is an object
        _.isEqual(mergedQuery.filters, mergeQuery({}, ctx.query).filters),
        _.every([ctx.query.filters, mergedQuery.filters], _.isNil),
      ]);

      const queryWithOffsetsReset = hasFilterChanged
        ? mergedQuery
        : _.mapValues(
            mergedQuery,
            (value, paramName) => (paramName.endsWith('offset') ? 0 : value),
          );

      return (
        <InternalLink pathname={pn} query={queryWithOffsetsReset} {...rest} />
      );
    }}
  </LocationSubscriber>
);

InternalLinkWithContext.defaultProps = {
  // eslint-disable-line fp/no-mutation
  mergeQuery: mq,
};

export default InternalLinkWithContext;
