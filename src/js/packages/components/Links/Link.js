/* @flow */

import React from 'react';

import InternalLink from 'components/Links/InternalLink';
import InternalLinkWithContext from 'components/Links/InternalLinkWithContext';

import type { LinkPropsType } from './types';

const needsContext = props => !props.pathname || props.merge || props.diff;

const Link = (props: LinkPropsType) => {
  const LinkComponent = needsContext(props)
    ? InternalLinkWithContext
    : InternalLink;

  return (
    <LinkComponent {...props} />
  );
};

export default Link;
