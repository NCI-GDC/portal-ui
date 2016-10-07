import ReactDOM from 'react-dom';
import React from 'react';

import Home from './Home';
import Project from './Project';
import Gene from './Gene';

// expose to angular
window.ReactComponents = {
  Home,
  Project,
  Gene,
};

window.Project = Project;
window.ReactDOM = ReactDOM;
window.React = React;
