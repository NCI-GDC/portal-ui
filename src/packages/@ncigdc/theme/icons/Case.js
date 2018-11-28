// @flow
import React from 'react';

export default ({ className = '', outline = false, ...props }) => (
  <i className={`${className} fa fa-user${outline ? '-o' : ''}`} {...props} />
);
