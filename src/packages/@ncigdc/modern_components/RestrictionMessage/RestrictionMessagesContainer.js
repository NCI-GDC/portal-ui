import React from 'react';

const RestrictionMessagesContainer = ({ children }) => (
  <div
    style={{
      alignContent: 'center',
      display: 'flex',
      justifyContent: 'center',
      padding: '40px 20px',
      width: '100%',
    }}
    >
    {children}
  </div>
);

export default RestrictionMessagesContainer;
