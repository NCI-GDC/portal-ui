// @flow
import React from 'react';
import { stringify, parse } from 'query-string';
import { compose, withPropsOnChange } from 'recompose';
import PropTypes from 'prop-types';

const withRouter = component => {
  return class extends React.Component {
    static displayName = `withRouter(${component.displayName ||
      component.name})`;

    static contextTypes = {
      router: PropTypes.shape({
        history: PropTypes.shape({
          listen: PropTypes.func.isRequired,
        }).isRequired,
      }).isRequired,
    };

    unlisten = () => {};
    componentWillMount() {
      this.unlisten = this.context.router.history.listen(() =>
        this.forceUpdate(),
      );
    }

    componentWillUnmount() {
      this.unlisten();
    }

    render() {
      const history = this.context.router.history;
      const location = this.context.router.history.location;
      return React.createElement(component, {
        ...this.props,
        history,
        location,
        query: parse(location.search),
      });
    }
  };
};

const enhance = compose(
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
  })),
);

const withBetterRouter = Wrapped => enhance(props => <Wrapped {...props} />);

export default withBetterRouter;
