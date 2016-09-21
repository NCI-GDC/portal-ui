/* @flow */
/* eslint better/no-ifs:0 */

import React from 'react';
import ReactDOM from 'react-dom';

import { AppContainer } from 'react-hot-loader';

import Root from './Root';

const rootEl = document.getElementById('app');

ReactDOM.render(
  <AppContainer><Root /></AppContainer>,
  rootEl
);

if (module.hot) {
  // $FlowIgnore
  module.hot.accept(Root, () => {
    ReactDOM.render(
      <AppContainer><Root /></AppContainer>,
      rootEl
    );
  });
}
