// @flow

import React from 'react';
import { Route } from 'react-router-dom';
import AnnotationSummary from '@ncigdc/modern_components/AnnotationSummary';

export default (
  <Route
    component={({ match, annotationId = match.params.id }) => (
      <AnnotationSummary annotationId={annotationId} />
    )}
    path="/annotations/:id" />
);
