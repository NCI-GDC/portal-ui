/* eslint-disable no-sequences */

import React from 'react';

export default (additionalMessage = '') => Component => props => (
  additionalMessage && console.log(additionalMessage),
  console.info(
    `%ctracing ${Component.displayName} props:\n${'tracing '.replace(
      /./g,
      '=',
    )}${Component.displayName.replace(/./g, '=')}=${'props:'.replace(
      /./g,
      '=',
    )}`,
    'color: rgb(22, 138, 96);font-weight: bold;',
  ),
  console.log(props),
  <Component {...props} />
);
