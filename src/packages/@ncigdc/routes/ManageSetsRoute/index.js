/* @flow */
import React from 'react';
import { Route } from 'react-router-dom';
import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';

const ManageSetsRoute = (
  <Route
    path="/manage-sets"
    component={LoadableWithLoading({
      loader: () => import('./ManageSetsPage'),
    })}
  />
);

export default ManageSetsRoute;
