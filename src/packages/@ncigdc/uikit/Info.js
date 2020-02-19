// @flow

// Vendor
import React from 'react';
import PropTypes from 'prop-types';

// Custom
import { Row } from './Flex';
import { withTheme } from '../theme';

/*----------------------------------------------------------------------------*/

const styles = {
  alert: {
    alignItems: 'center',
    padding: '0.7rem 1.2rem',
    fontSize: '1.5rem',
    color: 'black',
  },
};

const Info = ({
  children, style, theme, ...props
}) => (
  <Row
    style={{
      backgroundColor: theme.alertInfo,
      border: '1px solid #d9edf2',
      ...styles.alert,
      ...style,
    }}
    {...props}
    >
    {children}
  </Row>
);

Info.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
};

/*----------------------------------------------------------------------------*/

export default withTheme(Info);
