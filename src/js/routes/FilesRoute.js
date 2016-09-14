import React from 'react';
import { Route } from 'react-router';

import FilesPage from 'containers/FilesPage';
import { prepareViewerParams } from 'routes/utils';
import { viewerQuery } from 'routes/queries';

const FilesRoute = (
  <Route
    path="/files"
    component={FilesPage}
    prepareParams={prepareViewerParams}
    queries={viewerQuery}
  />
);

export default FilesRoute;
