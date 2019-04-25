import React from 'react';

export default ({ children, style = {}, ...props }) => (
  <h1
    style={{
      flexGrow: 1,
      fontSize: '2.2rem',
      marginBottom: 7,
      marginTop: 7,
      display: 'flex',
      alignItems: 'center',
      ...style,
    }}
    {...props}
  >
    {children}
  </h1>
);
