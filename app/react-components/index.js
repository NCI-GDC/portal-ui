import ReactDOM from 'react-dom';
import React from 'react';

import Home from './Home';
import Project from './Project';

// expose to angular
window.ReactComponents = {
  Home,
  Project,
};
window.ReactDOM = ReactDOM;
window.React = React;
