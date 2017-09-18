// @flow
import React from 'react';

export default ({ className = '', ...props }) => (
  <i className={`${className} icon-gdc-data`} {...props} />
);
