import React from 'react';

import InternalLink from './InternalLink';
import InternalLinkWithContext from './InternalLinkWithContext';

import { TLinkProps } from './types';

const needsContext = (props: TLinkProps) => !props.pathname || props.merge;

const Link = (props: TLinkProps) => {
  const LinkComponent = needsContext(props)
    ? InternalLinkWithContext
    : InternalLink;

  return <LinkComponent {...props} />;
};

export default Link;
