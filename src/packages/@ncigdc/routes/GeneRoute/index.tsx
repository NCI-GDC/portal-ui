import React from 'react';
import { Route } from 'react-router-dom';
import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';

export default (
  <Route
    path="/genes/:id"
    component={LoadableWithLoading({ loader: () => import('./GeneRoute') })}
  />
);
