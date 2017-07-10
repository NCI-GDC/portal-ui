import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';
import { Link } from 'react-router-dom';
import Components from '@ncigdc/modern_components';
import { Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { setDraggingComponent } from './dux';

const typeSource = {
  beginDrag({ dispatch, type }) {
    dispatch(setDraggingComponent(type));
    return {};
  },
};

function collectType(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

const ComponentBubble = compose(
  connect(),
  DragSource('type', typeSource, collectType),
)(({ isDragging, connectDragSource, type }) =>
  connectDragSource(
    <div
      style={{
        backgroundColor: isDragging ? 'rgb(18, 143, 182)' : 'white',
        borderRadius: 4,
        padding: '3px 5px',
        margin: 5,
        cursor: 'pointer',
      }}
    >
      {type}
    </div>,
  ),
);

export default ({ pathname, edit }) =>
  <Column
    style={{
      backgroundColor: 'rgb(42, 42, 42)',
      position: 'fixed',
      width: '200px',
      height: '100vh',
      zIndex: 9999,
      top: 0,
      left: 0,
    }}
  >
    <h3 style={{ color: 'white', margin: 5 }}>Components:</h3>
    {Object.keys(Components).map(type =>
      <ComponentBubble key={type} type={type} />,
    )}
    <div style={{ marginTop: 'auto', padding: '20px 5px' }}>
      <Link to={`${pathname}?edit=${edit ? '' : 1}`}>
        <Button style={{ width: '100%' }}>
          SAVE
        </Button>
      </Link>
    </div>
  </Column>;
