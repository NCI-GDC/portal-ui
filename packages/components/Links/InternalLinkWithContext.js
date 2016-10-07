/* @flow */

import React from 'react';
import { LocationSubscriber } from 'react-router/locationBroadcast';
import InternalLink from './InternalLink';

import type { TLinkProps } from './types';

const mergeQuery = (q, ctxq) => ({
  ...ctxq,
  ...q,
});

const InternalLinkWithContext = ({ pathname, query, merge, ...rest }: TLinkProps) => (
  <LocationSubscriber>{
    contextLocation => {
      const pn = pathname || contextLocation.pathname;

      const q = merge
        ? mergeQuery(query, contextLocation.query)
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

export default InternalLinkWithContext;
