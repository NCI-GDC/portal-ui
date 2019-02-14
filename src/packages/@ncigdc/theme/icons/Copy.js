import React from 'react';

export default ({ className = '', ...props }) => (
  <i className={`${className} fa fa-copy`} {...props} />
);
