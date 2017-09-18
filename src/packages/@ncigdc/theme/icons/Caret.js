// @flow
import React from 'react';

type TProps = {
  className: string,
  direction: string,
};

export default ({ className = '', direction = 'down', ...props }: TProps) => (
  <i className={`${className} fa fa-caret-${direction}`} {...props} />
);
