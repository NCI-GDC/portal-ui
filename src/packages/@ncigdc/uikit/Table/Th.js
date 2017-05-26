// Vendor
import React from "react";
import PropTypes from "prop-types";

/*----------------------------------------------------------------------------*/

const styles = {
  th: {
    backgroundColor: "#dedddd",
    padding: "3px",
    lineHeight: "20px",
    textAlign: "left",
    whiteSpace: "nowrap"
  }
};

const Th = ({ style, children, ...props }) => (
  <th style={{ ...styles.th, ...style }} {...props}>{children}</th>
);

Th.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object
};

/*----------------------------------------------------------------------------*/

export default Th;
