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
import GeneRoute from '@ncigdc/routes/GeneRoute';
import AnalysisRoute from '@ncigdc/routes/AnalysisRoute';
import SSMRoute from '@ncigdc/routes/SSMRoute';
import ManageSetsRoute from '@ncigdc/routes/ManageSetsRoute';
import SmartSearchRoute from '@ncigdc/routes/SmartSearchRoute';
import ImageViewerRoute from '@ncigdc/routes/ImageViewerRoute';

const HomeRoute = LoadableWithLoading({
  loader: () => import('@ncigdc/routes/HomeRoute'),
});

const CartRoute = LoadableWithLoading({
  loader: () => import('@ncigdc/routes/CartRoute'),
});

const RepositoryRoute = LoadableWithLoading({
  loader: () => import('@ncigdc/routes/RepositoryRoute'),
});

const ExploreRoute = LoadableWithLoading({
  loader: () => import('@ncigdc/routes/ExploreRoute'),
});

const ProjectsRoute = LoadableWithLoading({
  loader: () => import('@ncigdc/routes/ProjectsRoute'),
});

const AnnotationsRoute = LoadableWithLoading({
  loader: () => import('@ncigdc/routes/AnnotationsRoute'),
});

const Routes = () => (
  <span>
    <Route>
      {({ location: { pathname } }) => <Head title={pathname.split('/')[1]} />}
    </Route>
    <Switch>
      <Route component={HomeRoute} exact path="/" />
      <Route component={CartRoute} exact path="/cart" />
      <Route component={RepositoryRoute} exact path="/repository" />
      <Route component={ExploreRoute} exact path="/exploration" />
      <Route component={ProjectsRoute} exact path="/projects" />
      <Route component={AnnotationsRoute} exact path="/annotations" />
      <Route component={SmartSearchRoute} exact path="/query" />
      {ProjectRoute}
      <Route component={FileRoute} path="/files/:id" />
      {CaseRoute}
      {AnnotationRoute}
      {GeneRoute}
      {ManageSetsRoute}
      {AnalysisRoute}
      {SSMRoute}
      {ImageViewerRoute}
      <Route component={ComponentsRoute} path="/components/:component" />
      <Route component={NotFound} />
    </Switch>
  </span>
);

export default Routes;
