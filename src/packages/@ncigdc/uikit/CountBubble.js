// @flow

// Vendor
import React from "react";
import PropTypes from "prop-types";

/*----------------------------------------------------------------------------*/

const styles = {
  countBubble: {
    marginLeft: "auto",
    backgroundColor: "#5b5151",
    fontSize: "1rem",
    color: "white",
    padding: ".2em .6em .3em",
    borderRadius: ".25em",
    fontWeight: "bold",
    height: "20px"
  }
};

const CountBubble = ({ style, children, ...props }) => (
  <a style={{ ...styles.countBubble, ...style }} {...props}>{children}</a>
);

/*----------------------------------------------------------------------------*/

export default CountBubble;
