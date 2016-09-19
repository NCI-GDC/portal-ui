import React from 'react';
import { Route } from 'react-router';

import App from 'containers/App';

import FilesRoute from 'routes/FilesRoute';
import FileRoute from 'routes/FileRoute';
import AnnotationsRoute from 'routes/AnnotationsRoute';
import AnnotationRoute from 'routes/AnnotationRoute';

export default (
  <Route
    path="/"
    component={App}
    children={[
      FilesRoute,
      FileRoute,
      AnnotationRoute,
      AnnotationsRoute,
    ]}
  />
);
