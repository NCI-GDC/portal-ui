import React from 'react';

export default ({ x = 0, y = 0, children }) => (
  <div style={{ position: 'absolute', transform: `translate(${x}px, ${y}px)` }}>
    {children}
  </div>
);
