import React from 'react';
import { ExclamationTriangleIcon } from '@ncigdc/theme/icons';

export default ({ children, style, ...props }) => (
  <div
    style={{
      marginTop: 10,
      paddingRight: '5px',
      backgroundColor: '#fcf8e3',
      borderColor: '#faebcc',
      color: '#8a6d3b',
      padding: '15px',
      border: '1px solid transparent',
      borderRadius: '4px',
      ...style,
    }}
    {...props}
  >
    <ExclamationTriangleIcon /> {children}
  </div>
);
