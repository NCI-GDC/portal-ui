// @flow
import React from 'react';

export default ({ className = '', style = {}, ...props }) => (
  <i style={style} className={`${className} fa fa-shopping-cart`} {...props} />
);
