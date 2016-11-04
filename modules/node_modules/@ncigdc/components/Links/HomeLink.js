/* @flow */

import React from 'react';
import Link from './Link';

type TProps = {|
  children?: mixed,
|};

const HomeLink = (props: TProps) => (
  <Link pathname="/">{props.children || 'home'}</Link>
);

export default HomeLink;
