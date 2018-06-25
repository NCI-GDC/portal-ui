import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Head from '@ncigdc/components/Head';
import NotFound from '@ncigdc/components/NotFound';
import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';
import FileRoute from '@ncigdc/routes/FileRoute';
import AuthRoute from '@ncigdc/routes/AuthRoute';
// import AnnotationRoute from '@ncigdc/routes/AnnotationRoute';
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
  loader: () => import('@ncigdc/routes/ProjectRoute/ProjectRoute'),
});

const CaseRoute = LoadableWithLoading({
  loader: () => import('@ncigdc/routes/CaseRoute/CaseRoute'),
});

// const AnnotationRoute = LoadableWithLoading({
//   loader: () => import('@ncigdc/routes/AnnotationRoute'),
// });

export default () => (
  <span>
    <Route children={p => <Head title={p.location.pathname.split('/')[1]} />} />
    <Switch>
      <AuthRoute
        exact
        path="/"
        component={() => <Redirect to={'/repository'} />}
      />
      <AuthRoute exact path="/cart" component={CartRoute} />
      <AuthRoute exact path="/repository" component={RepositoryRoute} />
      <AuthRoute exact path="/projects" component={ProjectsRoute} />
      <AuthRoute exact path="/annotations" component={AnnotationsRoute} />
      <AuthRoute path="/projects/:id" component={ProjectRoute} />
      <AuthRoute path="/files/:id" component={FileRoute} />
      <AuthRoute path="/cases/:id" component={CaseRoute} />
      <AuthRoute
        path="/annotations/:id"
        component={({ match, annotationId = match.params.id }) => (
          <AnnotationSummary annotationId={annotationId} />
        )}
      />
      <Route component={NotFound} />
    </Switch>
  </span>
);
