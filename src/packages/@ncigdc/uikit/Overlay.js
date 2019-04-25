import React from 'react';

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
  show: {
    opacity: 1,
    pointerEvents: 'all',
    cursor: 'default',
  },
  hide: {
    opacity: 0,
    pointerEvents: 'none',
  },
};

const Overlay = ({
  children, style, show, ...props
}) => (
  <div
    style={{
      ...styles.container,
      ...style,
      ...(show ? styles.show : styles.hide),
    }}
    {...props}>
    {children}
  </div>
);

export default Overlay;
