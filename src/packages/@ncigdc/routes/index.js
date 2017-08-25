import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';
import ProjectRoute from '@ncigdc/routes/ProjectRoute';
import FileRoute from '@ncigdc/routes/FileRoute';
import CaseRoute from '@ncigdc/routes/CaseRoute';
import CartRoute from '@ncigdc/routes/CartRoute';
import AnnotationRoute from '@ncigdc/routes/AnnotationRoute';
import GeneRoute from '@ncigdc/routes/GeneRoute';
import SSMRoute from '@ncigdc/routes/SSMRoute';
import SmartSearchRoute from '@ncigdc/routes/SmartSearchRoute';
import NotFound from '@ncigdc/components/NotFound';
import * as ModernComponents from '@ncigdc/modern_components';

const HomeRoute = LoadableWithLoading({
  loader: () => import('@ncigdc/routes/HomeRoute'),
});

const RepositoryRoute = LoadableWithLoading({
  loader: () => import('@ncigdc/routes/RepositoryRoute'),
});

const AnnotationsRoute = LoadableWithLoading({
  loader: () => import('@ncigdc/routes/AnnotationsRoute'),
});

const ExploreRoute = LoadableWithLoading({
  loader: () => import('@ncigdc/routes/ExploreRoute'),
});

const ProjectsRoute = LoadableWithLoading({
  loader: () => import('@ncigdc/routes/ProjectsRoute'),
});

export default () =>
  <Switch>
    <Route exact path="/" component={HomeRoute} />
    <Route exact path="/repository" component={RepositoryRoute} />
    <Route exact path="/exploration" component={ExploreRoute} />
    <Route exact path="/projects" component={ProjectsRoute} />
    <Route exact path="/annotations" component={AnnotationsRoute} />
    <Route exact path="/query" component={SmartSearchRoute} />
    <Route path="/files/:id" component={FileRoute} />
    {ProjectRoute}
    {CaseRoute}
    {AnnotationRoute}
    {CartRoute}
    {GeneRoute}
    {SSMRoute}
    <Route
      path="/components/:component"
      component={({ match, ...props }) => {
        const Component = ModernComponents[match.params.component];
        return Component
          ? <Component />
          : <h1>No matching component found.</h1>;
      }}
    />
    <Route component={NotFound} />
  </Switch>;
