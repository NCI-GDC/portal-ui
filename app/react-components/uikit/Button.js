// Vendor
import React from 'react';
import { style as styles, merge } from 'glamor';

// Custom
import theme from '../theme';
import { center, margin } from '../theme/mixins';

/*----------------------------------------------------------------------------*/

const buttonStyles = styles({
  ...center,
  position: 'relative',
  cursor: 'pointer',
  padding: '6px 12px',
  fontSize: '14px',
  borderRadius: '4px',
  borderColor: 'transparent',
  borderWidth: 1,
  borderStyle: 'solid',
  backgroundColor: '#ff0',
  color: 'white',
  transition: '0.25s ease',
  ':hover': {
    backgroundColor: theme.greyScale6,
  },
});

const centerStyles = styles(center);

const Button = ({ style, children, rightIcon, leftIcon, ...props }) => (
  <button {...merge(buttonStyles, styles(style))} {...props}>
    {leftIcon}
    <span {...merge(styles(margin(leftIcon, rightIcon)), centerStyles)}>{children}</span>
    {rightIcon}
  </button>
);

Button.propTypes = {
  children: React.PropTypes.node,
  style: React.PropTypes.object,
  leftIcon: React.PropTypes.node,
  rightIcon: React.PropTypes.node,
  onClick: React.PropTypes.func,
};

export default Button;
