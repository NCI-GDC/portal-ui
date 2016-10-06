/* @flow */

import React from 'react';
import Link from 'react-router/Link';

import type { TLinkProps } from './types';

const InternalLink = ({ pathname, query, state, ...rest }: TLinkProps) => (
  <Link
    to={{
      pathname,
      query,
      state,
    }}
    {...rest}
  />
);

export default InternalLink;
