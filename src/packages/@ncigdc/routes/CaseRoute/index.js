import React from 'react';
import { Route } from 'react-router-dom';
import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';

export default (
  <Route
    path="/cases/:id"
    component={LoadableWithLoading({ loader: () => import('./CaseRoute') })}
  />
);
