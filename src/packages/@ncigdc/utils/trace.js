/* eslint-disable no-sequences */

import React from 'react';
import { branch, renderComponent } from 'recompose';

/**
* Utility HOC designed to easily log received props.

* usage:

  trace('Trying to fix issue #12')(Button)

  compose(
    global.trace() // string argument is optional.
  )
*/

export default (additionalMessage = '') => Component =>
  branch(
    () => process.env.NODE_ENV === 'production',
    renderComponent(Component),
  )(
    props => (
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
    ),
  );
