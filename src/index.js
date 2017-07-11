/* @flow */

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { setTheme } from '@ncigdc/theme';

global.trace = process.env.NODE_ENV === 'production'
  ? C => p => <C {...p} />
  : require('@ncigdc/utils/trace.js').default;

const Root = require('./Root').default;

setTheme('active');

ReactDOM.render(<Root />, document.getElementById('root'));
