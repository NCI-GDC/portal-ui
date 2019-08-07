// @flow
import React from 'react';
import {
  parse,
  stringify,
} from 'query-string';
import {
  compose,
  setDisplayName,
  withPropsOnChange,
} from 'recompose';
import PropTypes from 'prop-types';

const withRouter = component => class ComponentWithRouter extends React.Component {
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        listen: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  unlisten = () => {};

  componentWillMount() {
    const {
      router: {
        history,
      },
    } = this.context;
    this.unlisten = history.listen(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const {
      router: {
        history,
        history: { location },
      },
    } = this.context;
    return React.createElement(component, {
      ...this.props,
      history,
      location,
      query: parse(location.search),
    });
  }
};

export default compose(
  setDisplayName('withRouter'),
  withRouter,
  withPropsOnChange(['location'], ({ history: { push } }) => ({
    push: opts => {
      if (typeof opts === 'object') {
        push({
          pathname: opts.pathname,
          search: `?${stringify(opts.query)}`,
          state: opts.state,
        });
      } else {
        push(opts);
      }
    },
  }))
);
