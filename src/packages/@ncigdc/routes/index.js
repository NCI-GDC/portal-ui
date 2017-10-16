import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
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
import Login from './Login';
import Aux from '@ncigdc/utils/Aux';

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

export default withRouter(
  connect(state => ({
    loginRequired: state.auth.loginRequired,
    user: state.auth.user,
  }))(({ loginRequired, user }) => (
    <span>
      {loginRequired && !user && <Route children={p => <Login />} />}
      {(!loginRequired || !!user) && (
          <Aux>
            <Route
              children={p => <Head title={p.location.pathname.split('/')[1]} />}
            />
            <Switch>
              <Route exact path="/" component={HomeRoute} />
              <Route exact path="/cart" component={CartRoute} />
              <Route exact path="/repository" component={RepositoryRoute} />
              <Route exact path="/exploration" component={ExploreRoute} />
              <Route exact path="/projects" component={ProjectsRoute} />
              <Route exact path="/annotations" component={AnnotationsRoute} />
              <Route exact path="/query" component={SmartSearchRoute} />
              {ProjectRoute}
              <Route path="/files/:id" component={FileRoute} />
              {CaseRoute}
              {AnnotationRoute}
              {GeneRoute}
              {ManageSetsRoute}
              {AnalysisRoute}
              {SSMRoute}
              <Route
                path="/components/:component"
                component={ComponentsRoute}
              />
              <Route component={NotFound} />
            </Switch>
          </Aux>
        )}
    </span>
  )),
);
