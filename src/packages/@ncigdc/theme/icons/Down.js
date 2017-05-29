// @flow
import React from 'react';
import validAttributes from '@ncigdc/theme/utils/validAttributes';

type TProps = {
  className?: string,
};

export default ({ className = '', ...props }: TProps = {}) => (
  <i className={`${className} fa fa-caret-down`} {...validAttributes(props)} />
);
