// @flow

// Vendor
import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { withTheme } from '@ncigdc/theme';

/*----------------------------------------------------------------------------*/

const aStyle = css({
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'underline',
  },
});

const A = ({ style, children, theme, ...props }) => (
  <a
    className={aStyle}
    style={{ color: theme.primaryLight1, ...style }}
    {...props}
  >
    {children}
  </a>
);

A.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node,
};

/*----------------------------------------------------------------------------*/

export default withTheme(A);
