// @flow
import React from 'react';
import styled from '@ncigdc/theme/styled';

const Box = styled.span({
  backgroundColor: ({ theme }) => theme.greyScale4,
  width: '20px',
  height: '16px',
  display: 'inline-block',
});

const GreyBox = () => <Box />;

export default GreyBox;
