// @flow
import React from 'react';

const HideIcon = ({ className = '', ...props }) => (
  <i className={`${className} fa fa-eye-slash`} {...props} />
);

export default HideIcon;
