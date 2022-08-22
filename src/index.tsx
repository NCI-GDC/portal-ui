import 'babel-polyfill';
import { hot } from 'react-hot-loader/root';

import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';


// version has been updated from v3.1.3 to v3.8.2
// additional push
const Compose = process.env.NODE_ENV === 'development' ? hot(Root) : Root;
ReactDOM.render(<Compose />, document.getElementById('root'));