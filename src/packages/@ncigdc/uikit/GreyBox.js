// @flow
import React from 'react';
import styled from '@ncigdc/theme/styled';

const Box = styled.span({
  backgroundColor: ({ theme }) => theme.greyScale4,
  width: '20px',
  height: '16px',
  display: 'inline-block',
});

const GreyBox = ({ style }: { style: Object }) => <Box style={{ ...style }} />;

export default GreyBox;
