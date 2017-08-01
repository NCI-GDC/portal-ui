// @flow
import React from 'react';
import { withRouter } from 'react-router-dom';
import { stringify, parse } from 'query-string';
import { compose, withPropsOnChange, withProps } from 'recompose';

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
  withProps(props => ({
    query: parse(props.location.search),
  })),
);

const withBetterRouter = Wrapped => enhance(props => <Wrapped {...props} />);

export default withBetterRouter;
