// @flow

// This component exists to satisfy this eslint rule "jsx-a11y/no-static-element-interactions"
// Such that something is semantically clickable but not styled like a button

import React from 'react';

const base = {
  backgroundColor: 'inherit',
  border: 'none',
  cursor: 'pointer',
  outline: 'none',
  padding: 0,
};

const UnstyledButton = ({ children, style, ...props }) => (
  <button
    {...props}
    style={{
      ...base,
      ...style,
    }}
    type="button"
    >
    {children}
  </button>
);

export default UnstyledButton;
