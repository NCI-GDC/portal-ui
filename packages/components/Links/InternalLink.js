/* @flow */

import React from 'react';
import Link from 'react-router/Link';

import type { LinkPropsType } from './types';

const InternalLink = ({ pathname, query, state, ...rest }: LinkPropsType) => (
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
