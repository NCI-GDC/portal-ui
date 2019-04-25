/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import withRouter from '@ncigdc/utils/withRouter';
import namespace from '@ncigdc/utils/namespace';
import Link from './Link';
import { iconLink } from '@ncigdc/theme/mixins';
import { updateBackLocation } from '@ncigdc/dux/backLocation';

type TProps = {
  dispatch: Function,
  children?: mixed,
  style?: Object,
  isIcon?: boolean,
  onClick?: Function,
  router: Object,
};

const ImageViewerLink = compose(
  namespace('router', withRouter),
  connect(),
)(
  ({
    dispatch,
    children,
    router,
    style,
    onClick = () => {},
    isIcon = false,
    ...props
  }: TProps) => (
    <Link
      pathname="/image-viewer"
      onClick={() => {
        // saving back location to redux because
        // image viewer updates the url to switch between slides & cases
        // but user would like to go back to non-image viewer location
        dispatch(updateBackLocation(router.location));
        onClick();
      }}
      style={{
        ...(isIcon && iconLink),
        ...style,
      }}
      {...props}
    >
      {children || 'View Image'}
    </Link>
  ),
);

export default ImageViewerLink;
