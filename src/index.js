/* @flow */

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

global.trace = require('@ncigdc/utils/trace').default;

const Root = require('./Root').default;

ReactDOM.render(<Root />, document.getElementById('root'));
