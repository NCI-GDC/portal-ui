// @flow

import React from 'react';
// import { Route } from 'react-router-dom';
import AuthRoute from '@ncigdc/routes/AuthRoute';
import AnnotationSummary from '@ncigdc/modern_components/AnnotationSummary';

export default (
  <AuthRoute
    exact
    path="/annotations/:id"
    component={({ match, annotationId = match.params.id }) => (
      <AnnotationSummary annotationId={annotationId} />
    )}
  />
);
