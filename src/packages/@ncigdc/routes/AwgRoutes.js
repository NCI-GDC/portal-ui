import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Head from '@ncigdc/components/Head';
import NotFound from '@ncigdc/components/NotFound';
import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';
import ProjectRoute from '@ncigdc/routes/ProjectRoute';
import FileRoute from '@ncigdc/routes/FileRoute';
import CaseRoute from '@ncigdc/routes/CaseRoute';
import AnnotationRoute from '@ncigdc/routes/AnnotationRoute';
import ComponentsRoute from '@ncigdc/routes/ComponentsRoute';

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

export default () => (
  <span>
    <Route children={p => <Head title={p.location.pathname.split('/')[1]} />} />
    <Switch>
      <Route exact path="/" component={() => 'login page'} />}
      <Route exact path="/cart" component={CartRoute} />
      <Route exact path="/repository" component={RepositoryRoute} />
      <Route exact path="/projects" component={ProjectsRoute} />
      <Route exact path="/annotations" component={AnnotationsRoute} />
      {ProjectRoute}
      <Route path="/files/:id" component={FileRoute} />
      {CaseRoute}
      {AnnotationRoute}
      <Route path="/components/:component" component={ComponentsRoute} />
      <Route component={NotFound} />
    </Switch>
  </span>
);
