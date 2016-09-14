import React from 'react';
import { Route } from 'react-router';

import AnnotationsPage from 'containers/AnnotationsPage';
import { prepareViewerParams } from 'routes/utils';
import { viewerQuery } from 'routes/queries';

const AnnotationsRoute = (
  <Route
    path="/annotations"
    component={AnnotationsPage}
    prepareParams={prepareViewerParams}
    queries={viewerQuery}
  />
);


export default AnnotationsRoute;
