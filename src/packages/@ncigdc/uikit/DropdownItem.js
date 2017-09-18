// @flow
import React from 'react';
import { css } from 'glamor';
import Row from './Flex/Row';

const itemStyle = {
  padding: '0.2rem 0.5rem',
  textDecoration: 'none',
  width: '100%',
  ':hover': {
    color: '#262626',
    backgroundColor: '#f5f5f5',
  },
};

export default ({ children, style, ...props }) => (
  <Row {...css(itemStyle, style)} {...props}>
    {children}
  </Row>
);
