// Vendor
import React, { PropTypes, Children, cloneElement } from 'react';
import Radium from 'radium';

/*----------------------------------------------------------------------------*/

const baseStyle = {
  display: 'flex',
  flexDirection: 'row',
  boxSizing: 'border-box',
  position: 'relative',
  outline: 'none',
};

const Row = ({ flex, wrap, style, spacing, children, ...props }) => (
  <div
    style={{
      ...baseStyle,
      flex,
      ...(wrap ? { flexWrap: 'wrap' } : {}),
      ...style,
    }}
    {...props}
  >
    {!spacing && children}
    {spacing && Children.map(children, (child, i) =>
      child &&
      cloneElement(child, {
        ...child.props,
        style: {
          ...(i ? { marginLeft: spacing } : {}),
          ...(child.props.style ? child.props.style : {}),
        },
      })
    )}
  </div>
);

Row.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  flex: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  wrap: PropTypes.bool,
  spacing: PropTypes.string,
};

/*----------------------------------------------------------------------------*/

export default Radium(Row);
