// @flow

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const AuthRoute = connect(s => s.auth)(
  class extends React.Component {
    render() {
      const { component: Component, user, ...props } = this.props;

      return (
        <Route
          {...props}
          render={matchProps => {
            return !user ? (
              <Redirect to="/login" />
            ) : (
              <Component {...props} {...matchProps} />
            );
          }} />
      );
    }
  },
);

export default AuthRoute;
