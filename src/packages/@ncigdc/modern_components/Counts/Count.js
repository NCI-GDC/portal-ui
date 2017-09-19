// @flow
import React from 'react';
import { get } from 'lodash';
import { compose, withProps, withPropsOnChange } from 'recompose';

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
)(({ count, children }) => (
  <span>{children ? children(count) : count.toLocaleString()}</span>
));
