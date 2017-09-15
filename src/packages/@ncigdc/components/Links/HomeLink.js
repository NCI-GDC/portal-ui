/* @flow */

import React from 'react';
import Link from './Link';

type TProps = {|
  children?: mixed,
  style?: Object,
|};

const HomeLink = ({ children, ...props }: TProps) => (
  <Link pathname="/" {...props}>
    {children || 'home'}
  </Link>
);

export default HomeLink;
