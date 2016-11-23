// Vendor
import React from 'react';
// import { createComponent } from 'react-fela';
// import Color from 'color';

// Custom
// import theme from 'theme';
// import { center, margin } from 'theme/mixins';

/*----------------------------------------------------------------------------*/

const Button = (() => {
  const margin = (left, right) => {
    if (left && right) {
      return { margin: '0 0.5rem' };
    } else if (left) {
      return { marginLeft: '0.5rem' };
    } else if (right) {
      return { marginRight: '0.5rem' };
    }
    return {};
  };

  const center = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const styles = {
    button: {
      ...center,
      position: 'relative',
      cursor: 'pointer',
      padding: '6px 12px',
      fontSize: '14px',
      borderRadius: '4px',
      backgroundColor: '#ff0',
      color: 'white',
      border: '1px solid transparent',
      transition: '0.25s ease',
      // ':hover': {
      //   backgroundColor: Color(theme.primary).lighten(0.3).rgbString(),
      // },
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

  return Button;
})();

export default Button;
