/* @flow */

import React from 'react';
import { LocationSubscriber } from 'react-router/locationBroadcast';

import { mergeQuery as mq } from '@ncigdc/utils/filters';

import type { TRawQuery } from '@ncigdc/utils/uri/types';

import InternalLink from './InternalLink';

import type { TLinkProps } from './types';


const InternalLinkWithContext = ({ pathname, query, merge, mergeQuery, ...rest }: TLinkProps) => (
  <LocationSubscriber>{
    (ctx: {| pathname: string, query: TRawQuery |}) => {
      const pn = pathname || ctx.pathname;

      const q = (merge && mergeQuery && query)
        ? mergeQuery(
          query,
          ctx.query,
          merge)
        : query;

      return (
        <InternalLink
          pathname={pn}
          query={q}
          {...rest}
        />
      );
    }
  }</LocationSubscriber>
);

InternalLinkWithContext.defaultProps = { // eslint-disable-line fp/no-mutation
  mergeQuery: mq,
};

export default InternalLinkWithContext;
