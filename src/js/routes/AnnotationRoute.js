import React from 'react';
import { Route } from 'react-router';

import AnnotationPage from 'containers/AnnotationPage';
import { prepareNodeParams } from 'routes/utils';
import { nodeQuery } from 'routes/queries';

const AnnotationRoute = (
  <Route
    path="/annotations/:id"
    component={AnnotationPage}
    prepareParams={prepareNodeParams('Annotation')}
    queries={nodeQuery}
  />
);

export default AnnotationRoute;
