// Vendor
import React, { PropTypes } from 'react';

// Custom
import uikit from './PropTypes';

/*----------------------------------------------------------------------------*/

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transition: 'opacity 0.35s ease',
  },
};

const Overlay = ({ children, style, show, ...props }) => (
  <div
    style={{
      ...styles.container,
      ...style,
      ...(show ? { opacity: 1 } : { opacity: 0 }),
    }}
    {...props}
  >
    {children}
  </div>
);

Overlay.propTypes = {
  ...uikit,
  show: PropTypes.bool,
};

/*----------------------------------------------------------------------------*/

export default Overlay;
