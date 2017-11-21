// @flow
import React from 'react';
import { get } from 'lodash';
import { compose, withProps } from 'recompose';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import GreyBox from '@ncigdc/uikit/GreyBox';

export default compose(
  withProps(({ viewer, path, loading }) => {
    return {
      count: loading ? '' : get(viewer, path, ''),
    };
  }),
  withPropsOnChange(['viewer'], ({ count, handleCountChange, loading }) => {
    if (!loading && handleCountChange) {
      handleCountChange(count);
    }
  }),
)(({ count, children, loading, style }) => {
  return children ? (
    children(count)
  ) : count === '' ? (
    <GreyBox />
  ) : (
    <span style={style}>{count.toLocaleString()}</span>
  );
});
