/* @flow */

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import { setTheme } from '@ncigdc/theme';

import Root from './Root';

setTheme('active');

ReactDOM.render(<Root />, document.getElementById('root'));
