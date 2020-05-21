import React from 'react';
import styled from '@ncigdc/theme/styled';
import { ITheme } from '@ncigdc/theme';

const Box = styled('span', {
  backgroundColor: ({ theme }: { theme: ITheme }) => theme.greyScale4,
  display: 'inline-block',
  height: '16px',
  width: '20px',
});

const GreyBox: React.SFC<{style?: React.CSSProperties}> = ({
  children = null,
  style,
}) => (
  <Box style={{ ...style }}>
    {children}
  </Box>
);

export default GreyBox;
