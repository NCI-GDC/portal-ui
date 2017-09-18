// @flow
import React from 'react';

type TProps = {
  className: string,
};

export default ({ className = '', ...props }: TProps) => (
  <i className={`${className} fa fa-question-circle`} {...props} />
);
