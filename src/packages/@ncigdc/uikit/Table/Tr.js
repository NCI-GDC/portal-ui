// Vendor
import React from "react";
import PropTypes from "prop-types";

/*----------------------------------------------------------------------------*/

const Tr = ({ style, children, ...props }) => (
  <tr style={style} {...props}>{children}</tr>
);

Tr.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object
};

/*----------------------------------------------------------------------------*/

export default Tr;
