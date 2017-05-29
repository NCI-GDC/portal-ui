/* @flow */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import { setTheme } from '@ncigdc/theme';

import Root from './Root';

declare var LEGACY: boolean;

const rootEl = document.getElementById('app');

setTheme(LEGACY ? 'legacy' : 'active');

ReactDOM.render(
  <Root />,
  rootEl
);
