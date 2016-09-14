import React from 'react';
import { Link } from 'react-router';

const App = (props) => (
  <div>
    <Link to={{ pathname: '/' }}>~~~home~~~</Link>
    <Link to={{ pathname: '/files' }}>~~~files~~~</Link>
    <Link to={{ pathname: '/annotations' }}>~~~annotations~~~</Link>
    {props.children}
  </div>
);

export default App;
