import React from 'react';
import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';
import AuthRoute from '@ncigdc/routes/AuthRoute';

export default (
  <AuthRoute
    exact
    path="/cases/:id"
    component={LoadableWithLoading({ loader: () => import('./CaseRoute') })}
  />
);
