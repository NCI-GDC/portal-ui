// @flow

import React from 'react';
import { connect } from 'react-redux';
import Overlay from '@ncigdc/uikit/Overlay';
import Spinner from './Material';

type TProps = {
  children?: mixed,
  loading: boolean,
  style?: Object,
  height?: string | number,
};

export const OverlayLoader = ({ loading }: { loading: boolean }) =>
  <Overlay show={loading} style={{ position: 'absolute', zIndex: 10 }}>
    <Spinner />
  </Overlay>;

export default (
  { children, style = {}, loading = true, height, ...props }: TProps = {},
) =>
  <div
    style={{ ...style, height: loading ? height || '1rem' : 'auto' }}
    {...props}
  >
    <OverlayLoader loading={loading} />
    {children}
  </div>;

export const ConnectedLoader = connect(s => ({
  loaders: s.loaders,
}))(
  ({ loaders, name, customLoader: CL }) =>
    CL
      ? <CL loading={loaders.includes(name)} />
      : <OverlayLoader loading={loaders.includes(name)} />,
);
