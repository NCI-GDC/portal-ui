import 'babel-polyfill';
import { hot } from 'react-hot-loader/root';

import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';

const Compose = process.env.NODE_ENV === 'development' ? hot(Root) : Root;
ReactDOM.render(<Compose />, document.getElementById('root'));
