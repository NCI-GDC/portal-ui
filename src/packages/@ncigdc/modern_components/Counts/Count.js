// @flow
import React from 'react';
import {
  get,
  isEqual,
} from 'lodash';
import { compose, withProps } from 'recompose';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';
import GreyBox from '@ncigdc/uikit/GreyBox';

export default compose(
  withProps(({ getter, path }) => ({
    getCount: getter || (v => get(v, path, '')),
  })),
  withProps(({
    getCount,
    loading,
    viewer,
  }) => ({
    count: loading ? '' : getCount(viewer),
  })),
  withPropsOnChange(
    (
      {
        viewer,
      },
      {
        viewer: nextViewer,
      },
    ) => !(
      isEqual(viewer, nextViewer)
    ),
    ({ count, handleCountChange, loading }) => {
      if (!loading && handleCountChange) {
        handleCountChange(count);
      }
    },
  ),
)(({
  children,
  count,
  loading,
  style,
}) => {
  return children ? (
    children(count, loading)
  ) : count === '' ? (
    <GreyBox
      style={{
        textAlign: 'center',
      }}
      >
      ...
    </GreyBox>
  ) : (
    <span style={style}>{count.toLocaleString()}</span>
  );
});
