// @flow
import React from 'react';
import { get } from 'lodash';
import { compose, withProps } from 'recompose';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';

export default compose(
  withProps(({ viewer, path }) => {
    return {
      count: get(viewer, path, ''),
    };
  }),
  withPropsOnChange(['viewer'], ({ count, handleCountChange, loading }) => {
    if (!loading && handleCountChange) {
      handleCountChange(count);
    }
  }),
)(
  ({ count, children }) =>
    children ? children(count) : <span>{count.toLocaleString()}</span>,
);
