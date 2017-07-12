/* @flow */

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { setTheme } from '@ncigdc/theme';

global.trace = require('@ncigdc/utils/trace').default;

const Root = require('./Root').default;

setTheme('active');

ReactDOM.render(<Root />, document.getElementById('root'));
