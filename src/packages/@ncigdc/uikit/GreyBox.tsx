import React from 'react';
import styled from '@ncigdc/theme/styled';
import { ITheme } from '@ncigdc/theme';

const Box = styled('span', {
  backgroundColor: ({ theme }: { theme: ITheme }) => theme.greyScale4,
  width: '20px',
  height: '16px',
  display: 'inline-block',
});

const GreyBox: React.SFC<{style?: React.CSSProperties}> = ({ style }) => <Box style={{ ...style }} />;

export default GreyBox;
