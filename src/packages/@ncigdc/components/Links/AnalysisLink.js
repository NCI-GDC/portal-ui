/* @flow */
import React from 'react';
import Link from './Link';

type TProps = {
  children?: mixed,
  style?: Object,
  ariaLabel: string,
};

const AnalysisLink = ({ children, ...props }: TProps) => (
  <Link aria-label={props.ariaLabel} pathname="/analysis" {...props}>
    {children || 'analysis'}
  </Link>
);

export default AnalysisLink;
