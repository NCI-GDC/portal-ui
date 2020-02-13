import React from 'react';
import { Route } from 'react-router-dom';
import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';

export default (
  <Route
    component={LoadableWithLoading({ loader: () => import('./SSMRoute') })}
    path="/ssms/:id"
    />
);
