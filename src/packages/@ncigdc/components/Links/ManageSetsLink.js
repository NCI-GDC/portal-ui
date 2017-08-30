/* @flow */
import React from 'react';
import Link from './Link';

type TProps = {|
  children?: mixed,
  style?: Object,
  activeStyle?: Object,
|};

export default ({ children, ...props }: TProps) =>
  <Link pathname="/manage-sets" {...props}>{children || 'Manage Sets'}</Link>;
