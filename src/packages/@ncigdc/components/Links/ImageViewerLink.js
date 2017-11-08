/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';

import withRouter from '@ncigdc/utils/withRouter';
import Link from './Link';
import { iconLink } from '@ncigdc/theme/mixins';
import styled from '@ncigdc/theme/styled';
import { updateBackLocation } from '@ncigdc/dux/backLocation';

type TProps = {
  children?: mixed,
  style?: Object,
  isIcon?: boolean,
  onClick?: Function,
};

const StyledImageViewerLink = styled(Link, {
  ...iconLink,
});

const enhance = compose(
  withRouter,
  connect(),
  withProps(({ onClick, dispatch, location }) => ({
    onClick: () => {
      console.log('boop');
      console.log(location);
      //dispatch(updateBackLocation(history.location));
      if (onClick) {
        onClick();
      }
    },
  })),
);

const ImageViewerLink = ({
  children,
  onClick,
  isIcon = false,
  ...props
}: TProps) =>
  isIcon ? (
    <StyledImageViewerLink
      pathname="/image-viewer"
      onClick={onClick}
      {...props}
    >
      {children || 'View Image'}
    </StyledImageViewerLink>
  ) : (
    <Link pathname="/image-viewer" onClick={onClick} {...props}>
      {children || 'View Image'}
    </Link>
  );

export default enhance(ImageViewerLink);
