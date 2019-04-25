import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Head from '@ncigdc/components/Head';
import NotFound from '@ncigdc/components/NotFound';
import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';
import FileRoute from '@ncigdc/routes/FileRoute';
import AuthRoute from '@ncigdc/routes/AuthRoute';
import AnnotationSummary from '@ncigdc/modern_components/AnnotationSummary';

const CartRoute = LoadableWithLoading({
  loader: () => import('@ncigdc/routes/CartRoute'),
});

const RepositoryRoute = LoadableWithLoading({
  loader: () => import('@ncigdc/routes/RepositoryRoute'),
});

const ProjectsRoute = LoadableWithLoading({
  loader: () => import('@ncigdc/routes/ProjectsRoute'),
});

const AnnotationsRoute = LoadableWithLoading({
  loader: () => import('@ncigdc/routes/AnnotationsRoute'),
});

const ProjectRoute = LoadableWithLoading({
  loader: () => import('@ncigdc/routes/ProjectRoute/AWGProjectRoute'),
});

const CaseRoute = LoadableWithLoading({
  loader: () => import('@ncigdc/routes/CaseRoute/CaseRoute'),
});

export default () => (
  <span>
    <Route children={p => <Head title={p.location.pathname.split('/')[1]} />} />
    <Switch>
      <AuthRoute
        component={() => <Redirect to="/repository" />}
        exact
        path="/" />
      <AuthRoute component={CartRoute} exact path="/cart" />
      <AuthRoute component={RepositoryRoute} exact path="/repository" />
      <AuthRoute component={ProjectsRoute} exact path="/projects" />
      <AuthRoute component={AnnotationsRoute} exact path="/annotations" />
      <AuthRoute component={ProjectRoute} path="/projects/:id" />
      <AuthRoute component={FileRoute} path="/files/:id" />
      <AuthRoute component={CaseRoute} path="/cases/:id" />
      <AuthRoute
        component={({ match, annotationId = match.params.id }) => (
          <AnnotationSummary annotationId={annotationId} />
        )}
        path="/annotations/:id" />
      <Route component={NotFound} />
    </Switch>
  </span>
);
