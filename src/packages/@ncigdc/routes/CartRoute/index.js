import React from 'react';
import { Route } from 'react-router-dom';
import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';

export default (
  <Route
    path="/cart"
    component={LoadableWithLoading({ loader: () => import('./CartRoute') })}
  />
);
