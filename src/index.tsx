import 'babel-polyfill';
import { hot } from 'react-hot-loader/root';

import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';

import '@datadog/browser-rum/bundle/datadog-rum'

window.DD_RUM.init({
  applicationId: 'c94f127b-dd40-44b7-9c28-17632610a9c6',
  clientToken: 'pub20202bcc06c0249365fd3445a71f7004',
  site: 'datadoghq.com',
  sampleRate: 100,
  premiumSampleRate: 100,
})

const Compose = process.env.NODE_ENV === 'development' ? hot(Root) : Root;
ReactDOM.render(<Compose />, document.getElementById('root'));