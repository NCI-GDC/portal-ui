import { Route } from 'react-router';
import { h } from 'react-hyperscript-helpers';

import App from 'containers/App';

import FilesRoute from 'routes/FilesRoute';
import FileRoute from 'routes/FileRoute';
import AnnotationsRoute from 'routes/AnnotationsRoute';
import AnnotationRoute from 'routes/AnnotationRoute';

export default (
  h(Route, {
    path: '/',
    component: App,
    children: [
      FilesRoute,
      FileRoute,
      AnnotationRoute,
      AnnotationsRoute,
    ],
  })
);
