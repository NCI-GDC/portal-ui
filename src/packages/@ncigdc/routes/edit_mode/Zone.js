/* @flow */

import React from 'react';
import { DropTarget } from 'react-dnd';
import Button from '@ncigdc/uikit/Button';

const zoneTarget = {
  drop(props, monitor) {
    props.setZones(z => [...z, { type: props.draggingType, userProps: {} }]);
  },
};

function collectZone(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
}

export const EmptyZone = DropTarget(
  'type',
  zoneTarget,
  collectZone,
)(({ isOver, connectDropTarget }) =>
  connectDropTarget(
    <div
      style={{
        color: isOver ? 'rgb(113, 204, 164)' : 'rgb(87, 87, 87)',
        border: '2px dotted',
        padding: 20,
      }}
    >
      + Insert Component
    </div>,
  ),
);

export const Zone = ({ edit, children, component, remove, style }) =>
  <div
    style={{
      position: 'relative',
      ...style,
    }}
  >
    {edit &&
      <div
        style={{
          position: 'absolute',
          zIndex: edit ? 10 : 0,
          backgroundColor: edit ? 'rgba(193, 255, 227, 0.3)' : 'transparent',
          width: '100%',
          height: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: 5,
            backgroundColor: 'rgb(50, 50, 50)',
            color: 'white',
          }}
        >
          <div>{component.type}</div>
          <div style={{ marginLeft: 'auto' }}>
            <Button onClick={remove}>X</Button>
          </div>
        </div>
      </div>}
    {children}
  </div>;
