/* @flow */

import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';
import Button from '@ncigdc/uikit/Button';

const zoneTarget = {
  drop(props, monitor) {
    props.setZones(z => [...z, { type: props.componentType, userProps: {} }]);
  },
};

function collectZone(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
}

export const EmptyZone = compose(
  connect(state => state.editMode),
  DropTarget('type', zoneTarget, collectZone),
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

export const Zone = ({
  edit,
  children,
  component,
  zoneIndex,
  remove,
  style,
  propTypes,
  changeProp,
}) =>
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
          backgroundColor: edit ? 'rgba(193, 255, 227, 0.2)' : 'transparent',
          width: '100%',
          height: '100%',
        }}
      />}
    {edit &&
      <div
        style={{
          backgroundColor: 'rgb(50, 50, 50)',
          color: 'white',
          zIndex: 20,
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: 5,
          }}
        >
          <div>{component.type}</div>
          <div style={{ marginLeft: 'auto' }}>
            <Button onClick={remove}>X</Button>
          </div>
        </div>
        {propTypes &&
          <div style={{ paddingBottom: 10 }}>
            {Object.keys(propTypes).map(prop =>
              <div
                key={prop}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '5px 10px',
                }}
              >
                <pre
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: 'none',
                    textShadow: 'none',
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {prop}:
                </pre>
                <input
                  style={{
                    padding: '4px 8px',
                    color: 'white',
                    marginLeft: 8,
                    backgroundColor: 'transparent',
                    borderRadius: 5,
                    border: '1px solid',
                  }}
                  defaultValue={component.userProps[prop]}
                  onChange={e =>
                    changeProp({ zoneIndex, prop, value: e.target.value })}
                />
              </div>,
            )}
          </div>}
      </div>}
    {children}
  </div>;
