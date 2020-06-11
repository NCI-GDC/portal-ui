// @flow
import React from 'react';

const CAIconMessage = ({
  children,
  faClass,
}) => (
  <span>
    <i className={`fa ${faClass}`} style={{ color: '#773388' }} />
    {' '}
    {children}
  </span>
);

export default CAIconMessage;
