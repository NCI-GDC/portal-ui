import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Head from '@ncigdc/components/Head';
import NotFound from '@ncigdc/components/NotFound';
import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';
import ProjectRoute from '@ncigdc/routes/ProjectRoute';
import FileRoute from '@ncigdc/routes/FileRoute';
import CaseRoute from '@ncigdc/routes/CaseRoute';
import AnnotationRoute from '@ncigdc/routes/AnnotationRoute';
import ComponentsRoute from '@ncigdc/routes/ComponentsRoute';
import Login from '@ncigdc/routes/Login';

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

const AuthRoute = connect(s => s.auth)(
  class extends React.Component {
    render() {
      let { component: Component, user } = this.props;

      console.log(123, this.props);

      return (
        <Route
          {...this.props}
          render={matchProps => {
            return !user ? (
              <Login {...this.props} {...matchProps} />
            ) : (
              <Component {...this.props} {...matchProps} />
            );
          }}
        />
      );
    }
  },
);

export default () => (
  <span>
    <Route children={p => <Head title={p.location.pathname.split('/')[1]} />} />
    <Switch>
      <AuthRoute
        exact
        path="/"
        component={() => <Redirect to={'/repository'} />}
      />
      <Route exact path="/login" component={Login} />
      <AuthRoute exact path="/cart" component={CartRoute} />
      <AuthRoute exact path="/repository" component={RepositoryRoute} />
      <AuthRoute exact path="/projects" component={ProjectsRoute} />
      <AuthRoute exact path="/annotations" component={AnnotationsRoute} />
      {ProjectRoute}
      <AuthRoute path="/files/:id" component={FileRoute} />
      {CaseRoute}
      {AnnotationRoute}
      <Route component={NotFound} />
    </Switch>
  </span>
);
