// Vendor
import React, { PropTypes } from 'react';

/*----------------------------------------------------------------------------*/

const styles = {
  td: {
    padding: '3px',
    border: '1px solid #ddd',
    whiteSpace: 'nowrap',
  },
};

const Td = ({ style, children, ...props }) => (
  <td style={{ ...styles.td, ...style }} {...props}>{children}</td>
);

Td.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
};

/*----------------------------------------------------------------------------*/

export default Td;
