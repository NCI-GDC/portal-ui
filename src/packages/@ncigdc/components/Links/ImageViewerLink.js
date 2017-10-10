/* @flow */
import React from 'react';
import Link from './Link';
import { iconLink } from '@ncigdc/theme/mixins';
import styled from '@ncigdc/theme/styled';

type TProps = {
  children?: mixed,
  style?: Object,
  isIcon?: boolean,
};

const StyledImageViewerLink = styled(Link, {
  ...iconLink,
});

const ImageViewerLink = ({ children, isIcon = false, ...props }: TProps) =>
  isIcon ? (
    <StyledImageViewerLink pathname="/image-viewer" {...props}>
      {children || 'View Image'}
    </StyledImageViewerLink>
  ) : (
    <Link pathname="/image-viewer" {...props}>
      {children || 'View Image'}
    </Link>
  );

export default ImageViewerLink;
