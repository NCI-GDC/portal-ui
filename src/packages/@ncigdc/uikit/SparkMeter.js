import React from 'react';
export default ({ value, width = 30, max = 30 }) =>
  <div
    style={{
      width,
      height: 8,
      backgroundColor: `rgb(209, 209, 209)`,
      margin: '0 5px',
      borderRadius: 2,
      display: 'inline-block',
      pointerEvents: 'none',
    }}
  >
    <div
      style={{
        width: Math.max(value * max, 2),
        height: 8,
        backgroundColor: `rgb(39, 156, 75)`,
        borderRadius: 2,
      }}
    />
  </div>;
