import React from 'react';
import { ExclamationTriangleIcon } from '@ncigdc/theme/icons';

const WarningBox = ({
  children,
  style,
  ...props
}) => (
  <figure
    style={{
      backgroundColor: '#fcf8e3',
      border: '1px solid transparent',
      borderColor: '#faebcc',
      borderRadius: '4px',
      color: '#8a6d3b',
      marginTop: 10,
      padding: '15px 5px 15px 40px',
      position: 'relative',
      ...style,
    }}
    {...props}
    >
    <ExclamationTriangleIcon
      style={{
        left: '15px',
        position: 'absolute',
        top: '18px',
      }}
      />
    {children}
  </figure>
);

export default WarningBox;
