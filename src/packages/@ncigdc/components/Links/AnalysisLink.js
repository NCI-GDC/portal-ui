/* @flow */
import React from 'react';
import Link from './Link';

type TProps = {
  children?: mixed,
  style?: Object,
};

const AnalysisLink = ({ children, ...props }: TProps) =>
  <Link pathname="/analysis" {...props}>{children || 'analysis'}</Link>;

export default AnalysisLink;
