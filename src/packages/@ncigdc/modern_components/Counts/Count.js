// @flow
import React from 'react';
import { get } from 'lodash';
import { compose, withProps, withPropsOnChange } from 'recompose';

export default compose(
  withProps(({ viewer, path }) => {
    return {
      count: get(viewer, path, 0),
    };
  }),
  withPropsOnChange(['viewer'], ({ count, handleCountChange, loading }) => {
    if (!loading && handleCountChange) {
      handleCountChange(count);
    }
  }),
)(({ count }) => <span>{count.toLocaleString()}</span>);
