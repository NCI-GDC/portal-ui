import React from 'react';
import { Route } from 'react-router-dom';
import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';

export default (
  <Route
    path="/projects/:id"
    component={LoadableWithLoading({ loader: () => import('./ProjectRoute') })}
  />
);
