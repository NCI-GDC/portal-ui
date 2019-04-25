import React from 'react';

export default ({ i, ...props }) => {
  return (
    <span {...props}>
      <em>S</em>
      <sub>{i}</sub>
    </span>
  );
};
