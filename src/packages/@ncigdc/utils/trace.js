/* eslint-disable no-sequences */

import React from 'react';

/**
 *  Utility HOC designed to easily log received props.
*/

/* Recommended to be put on the global namespace in development mode:

global.trace = process.env.NODE_ENV === 'production'
  ? C => p => <C {...p} />
  : require(<path_to_trace>).default;

*/

/* usage:

  global.trace('Trying to fix issue #12')(Button)

  compose(
    global.trace() // string argument is optional.
  )

*/

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
