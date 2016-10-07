/* @flow */

import React from 'react';
import Link from 'react-router/Link';
import JSURL from 'jsurl';

import { removeEmptyKeys } from '@ncigdc/utils/uri';

import type { TLinkProps } from './types';

const InternalLink = ({ pathname, query, ...rest }: TLinkProps) => {
  const q0 = query || {};
  const f0 = q0.filters
    ? JSURL.stringify(q0.filters)
    : null;
  console.log(f0);
  const q = removeEmptyKeys({
    ...q0,
    filters: f0,
  });

  return (
    <Link
      to={{
        pathname,
        query: q,
      }}
      {...rest}
    />
  );
};

export default InternalLink;
