// @flow
import React from 'react';

export default ({ className = '', text = false, ...props }) => (
  <i className={`${className} fa fa-file${text ? '-text-o' : ''}`} {...props} />
);
