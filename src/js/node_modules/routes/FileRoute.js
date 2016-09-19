import React from 'react';
import { Route } from 'react-router';

import FilePage from 'containers/FilePage';
import { prepareNodeParams } from 'routes/utils';
import { nodeQuery } from 'routes/queries';

const FileRoute = (
  <Route
    path="/files/:id"
    component={FilePage}
    prepareParams={prepareNodeParams('File')}
    queries={nodeQuery}
  />
);

export default FileRoute;
