import ReactDOM from 'react-dom';
import React from 'react';

import Home from './Home';
import Project from './Project';
import Gene from './Gene';
import Mutation from './Mutation';
import SideNavLayout from './layouts/SideNavLayout'

// expose to angular
window.ReactComponents = {
  Home,
  Project,
  Gene,
  Mutation,
  SideNavLayout,
};

window.Project = Project;
window.ReactDOM = ReactDOM;
window.React = React;
