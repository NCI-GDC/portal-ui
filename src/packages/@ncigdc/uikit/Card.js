// @flow

// Vendor
import React from 'react';
import PropTypes from 'prop-types';

// Custom
import { withTheme } from '@ncigdc/theme';

/*----------------------------------------------------------------------------*/

const styles = {
  card: {
    backgroundColor: 'white',
  },
  header: theme => ({
    padding: '1rem',
    color: theme.greyScale7,
  }),
};

const Card = ({ style, children, title, theme, ...props }) => (
  <div style={{ ...styles.card, ...style }} {...props}>
    {title && <div style={styles.header(theme)}>{title}</div>}
    {children}
  </div>
);

Card.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  title: PropTypes.node,
  theme: PropTypes.object,
};

/*----------------------------------------------------------------------------*/

export default withTheme(Card);
