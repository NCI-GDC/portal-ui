// @flow
import React from 'react';
import { get } from 'lodash';
import { compose, withProps } from 'recompose';

export default compose(
  withProps(({ viewer, path }) => {
    return {
      count: get(viewer, path, 0).toLocaleString(),
    };
  }),
)(({ count }) => <span>{count}</span>);
