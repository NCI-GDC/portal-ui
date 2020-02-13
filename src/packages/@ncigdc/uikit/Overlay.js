import React from 'react';

const styles = {
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    left: 0,
    pointerEvents: 'none',
    position: 'fixed',
    top: 0,
    transition: 'opacity 0.35s ease',
    width: '100%',
    zIndex: 9999,
  },
  hide: {
    opacity: 0,
    pointerEvents: 'none',
  },
  show: {
    cursor: 'default',
    opacity: 1,
    pointerEvents: 'all',
  },
};

const Overlay = ({ children, style, show, ...props }) => (
  <div
    style={{
      ...styles.container,
      ...style,
      ...(show ? styles.show : styles.hide),
    }}
    {...props}
  >
    {children}
  </div>
);

export default Overlay;
