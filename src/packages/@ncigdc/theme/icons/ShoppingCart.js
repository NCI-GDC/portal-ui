// @flow
import React from 'react';

export default ({ className = '', style = {}, ...props }) => (
  <i className={`${className} fa fa-shopping-cart`} style={style} {...props} />
);
