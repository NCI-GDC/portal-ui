// Vendor
import React from 'react';
import PropTypes from 'prop-types';

/*----------------------------------------------------------------------------*/

const styles = {
  td: {
    padding: '3px',
    whiteSpace: 'nowrap',
  },
};

const Td = ({ style = {}, children, ...props }) => (
  <td style={{ ...styles.td, ...style }} {...props}>
    {children}
  </td>
);

Td.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
};

/*----------------------------------------------------------------------------*/

export default Td;
