// @flow
import React from 'react';
import { Tooltip } from '@ncigdc/uikit/Tooltip';

export const bubbleStyle = {
  color: 'white',
  padding: '2px 5px',
  borderRadius: '8px',
  fontSize: '10px',
  fontWeight: 'bold',
  display: 'inline-block',
};

type TProps = {
  text: string,
  toolTipText: string,
  backgroundColor: string,
};

export default ({
  text,
  toolTipText,
  backgroundColor,
  style,
  ...props
}: TProps) => (
  <Tooltip Component={toolTipText} className={props.className + ' bubble-icon'}>
    <span
      style={{
        ...bubbleStyle,
        ...style,
        backgroundColor,
      }}
      {...props}
    >
      {text}
    </span>
  </Tooltip>
);
