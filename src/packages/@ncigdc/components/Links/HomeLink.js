/* @flow */

import React from 'react';
import Link from './Link';

type TProps = {|
  children?: mixed,
  style?: Object,
  activeStyle?: Object,
  exact?: boolean,
  className?: string,
  tabIndex?: string,
  ariaLabel: string,
|};

const HomeLink = ({ children, ...props }: TProps) => (
  <Link aria-label={props.ariaLabel} pathname="/" {...props}>
    {children || 'home'}
  </Link>
);

export default HomeLink;
