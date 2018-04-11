import React from 'react';
import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';
import AuthRoute from '@ncigdc/routes/AuthRoute';

export default (
  <AuthRoute
    exact
    path="/projects/:id"
    component={LoadableWithLoading({ loader: () => import('./ProjectRoute') })}
  />
);
