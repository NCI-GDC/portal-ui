// @flow
import React from 'react';

export default ({ className = '', ...props }) => (
  <i className={`${className} fa fa-th`} {...props} />
);
