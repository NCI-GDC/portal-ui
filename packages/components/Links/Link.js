/* @flow */

import React from 'react';

import InternalLink from './InternalLink';
import InternalLinkWithContext from './InternalLinkWithContext';

import type { TLinkProps } from './types';

const needsContext = props => !props.pathname || props.merge || props.diff;

const Link = (props: TLinkProps) => {
  const LinkComponent = needsContext(props)
    ? InternalLinkWithContext
    : InternalLink;

  return (
    <LinkComponent {...props} />
  );
};

export default Link;
