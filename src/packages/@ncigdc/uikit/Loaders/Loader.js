// @flow

import React from 'react';
import Overlay from '@ncigdc/uikit/Overlay';
import Spinner from './Material';

type TProps = {
  children?: mixed,
  loading: boolean,
  style?: Object,
  height?: string | number,
};

export const OverlayLoader = ({ loading }: { loading: boolean }) => (
  <Overlay show={loading} style={{ position: 'absolute', zIndex: 10 }}>
    <Spinner />
  </Overlay>
);

export default (
  { children, style = {}, loading = true, height, ...props }: TProps = {},
) => (
  <div
    style={{ ...style, height: loading ? height || '1rem' : 'auto' }}
    {...props}
  >
    <OverlayLoader loading={loading} />
    {children}
  </div>
);

type TWithLoader = {
  Loader: any,
  minHeight?: number,
  style: Object,
  loading: boolean,
  firstLoad: boolean,
};
export const withLoader = (Component: ReactClass<*>) => {
  return ({
    Loader = OverlayLoader,
    minHeight,
    style = { position: 'relative', width: '100%' },
    loading,
    firstLoad,
    ...props
  }: TWithLoader) => {
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          ...(minHeight ? { minHeight } : {}),
          ...style,
        }}
      >
        {!firstLoad && <Component loading={loading} {...props} />}
        <Loader loading={loading} />
      </div>
    );
  };
};
