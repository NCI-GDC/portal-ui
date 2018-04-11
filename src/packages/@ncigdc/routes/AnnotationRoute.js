// @flow

import React from 'react';
import AnnotationSummary from '@ncigdc/modern_components/AnnotationSummary';
import AuthRoute from '@ncigdc/routes/AuthRoute';

export default (
  <AuthRoute
    exact
    path="/annotations/:id"
    component={({ match, annotationId = match.params.id }) => (
      <AnnotationSummary annotationId={annotationId} />
    )}
  />
);
