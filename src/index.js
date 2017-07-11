/* @flow */

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { setTheme } from '@ncigdc/theme';

global.trace = process.env.NODE_ENV === 'production'
  ? require('@ncigdc/utils/trace').noop
  : require('@ncigdc/utils/trace').default;

const Root = require('./Root').default;

setTheme('active');

ReactDOM.render(<Root />, document.getElementById('root'));
