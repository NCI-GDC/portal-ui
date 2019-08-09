// @flow
import React from 'react';

const ShowIcon = ({ className = '', ...props }) => (
  <i className={`${className} fa fa-eye`} {...props} />
);

export default ShowIcon;
