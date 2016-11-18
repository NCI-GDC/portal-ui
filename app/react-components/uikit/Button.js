// Vendor
import React from 'react';
import Radium from 'radium';

// Custom
import theme from '../theme';
import { center, margin } from '../theme/mixins';

/*----------------------------------------------------------------------------*/

const styles = {
  button: {
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
  }
};

const Button = ({ style, children, rightIcon, leftIcon, ...props }) => (
  <button style={{...styles.button, ...style}} {...props}>
    {leftIcon}
    <span style={{ ...margin(leftIcon, rightIcon), ...center }}>{children}</span>
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

export default Radium(Button);
