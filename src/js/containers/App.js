import { Link } from 'react-router';
import { h, div } from 'react-hyperscript-helpers';

const App = (props) => (
  div({
    children: [
      h(Link, { to: { pathname: '/' } }, '~~~home~~~'),
      h(Link, { to: { pathname: '/files' } }, '~~~files~~~'),
      h(Link, { to: { pathname: '/annotations' } }, '~~~annotations~~~'),
      props.children,
    ],
  })
);

export default App;
