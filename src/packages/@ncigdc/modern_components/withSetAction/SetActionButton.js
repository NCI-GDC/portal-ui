import React from 'react';
import Button from '@ncigdc/uikit/Button';
import Overlay from '@ncigdc/uikit/Overlay';
import Spinner from '@ncigdc/uikit/Loaders/Material';

export default ({
  style,
  children,
  disabled,
  createSet,
  Component = Button,
  ...props
}) => {
  return (
    <span>
      <Overlay show={props.isCreating}>
        <Spinner />
      </Overlay>
      <Component
        disabled={disabled}
        style={style}
        onClick={() => createSet(props)}
      >
        {children}
      </Component>
    </span>
  );
};
