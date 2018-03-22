// @flow
import React from 'react';
import { get } from 'lodash';
import { compose, withProps } from 'recompose';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import GreyBox from '@ncigdc/uikit/GreyBox';

export default compose(
  withProps(({ getter, path }) => ({
    getCount: getter ? getter : v => get(v, path, ''),
  })),
  withProps(({ viewer, path, loading, getCount }) => {
    return {
      count: loading ? '' : getCount(viewer),
    };
  }),
  withPropsOnChange(['viewer'], ({ count, handleCountChange, loading }) => {
    if (!loading && handleCountChange) {
      handleCountChange(count);
    }
  }),
)(({ count, children, loading, style }) => {
  return children ? (
    children(count, loading)
  ) : count === '' ? (
    <GreyBox />
  ) : (
    <span style={style}>{count.toLocaleString()}</span>
  );
});
