// Vendor
import React, { PropTypes } from 'react';

/*----------------------------------------------------------------------------*/

const Tr = ({ style, children, ...props }) => (
  <tr style={style} {...props}>{children}</tr>
);

Tr.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
};

/*----------------------------------------------------------------------------*/

export default Tr;
