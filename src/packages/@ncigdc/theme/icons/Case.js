// @flow
import React from 'react';

export default ({ className = '', outline, ...props }) => (
  <i className={`${className} fa fa-user${outline ? '-o' : ''}`} {...props} />
);
