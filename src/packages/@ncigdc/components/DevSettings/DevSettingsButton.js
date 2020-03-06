// @flow
import React from 'react';

import Button from '@ncigdc/uikit/Button';

const buttonStyle = {
  background: 'white',
  border: '1px solid #ccc',
  color: 'black',
  display: 'inline-block',
  marginBottom: 5,
  marginRight: 5,
};

const DevControlsButton = ({
  active = false,
  buttonClickHandler,
  children,
  style = {},
}) => (
  <Button
    onClick={buttonClickHandler}
    style={{
      ...buttonStyle,
      ...style,
      ...active && { background: 'PowderBlue' },
    }}
    >
    {children}
  </Button>
);

export default DevControlsButton;
