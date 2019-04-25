/* @flow */
import React from 'react';
import { Route } from 'react-router-dom';
import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';

const ManageSetsRoute = (
  <Route
    component={LoadableWithLoading({
      loader: () => import('./ManageSetsPage'),
    })}
    path="/manage-sets" />
);

export default ManageSetsRoute;
