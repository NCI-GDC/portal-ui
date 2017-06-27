import React from 'react';
export default ({ value, width = 30, max = 30 }) =>
  <div
    style={{
      display: 'inline-block',
      position: 'relative',
      height: 8,
      width: width + 10,
      pointerEvents: 'none',
    }}
  >
    <span
      style={{
        position: 'absolute',
        display: 'inline-block',
        width,
        height: 8,
        backgroundColor: `rgb(209, 209, 209)`,
        margin: '0 5px',
        borderRadius: 2,
      }}
    />
    <span
      style={{
        position: 'absolute',
        display: 'inline-block',
        width: Math.max(value * max, 2),
        height: 8,
        backgroundColor: `rgb(39, 156, 75)`,
        margin: '0 5px',
        borderRadius: 2,
      }}
    />
  </div>;
