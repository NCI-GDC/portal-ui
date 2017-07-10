/* @flow */

import React from 'react';
import { compose, withState } from 'recompose';
import { parse } from 'query-string';
import { Link } from 'react-router-dom';
import Route from 'react-router/Route';
import { DragDropContext, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Button from '@ncigdc/uikit/Button';

import Components from '@ncigdc/modern_components';

import { DragSource } from 'react-dnd';

let dragging;

const typeSource = {
  beginDrag(props) {
    dragging = props.type;
    return {};
  },
};

function collectType(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

const zoneTarget = {
  drop(props, monitor) {
    props.setZones(z => [...z, dragging]);
    dragging = null;
  },
};

function collectZone(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
}

const ComponentBubble = DragSource(
  'type',
  typeSource,
  collectType,
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

const EmptyZone = DropTarget(
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

const Zone = ({ edit, children, type, remove }) =>
  <div
    style={{
      position: 'relative',
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
          <div>{type}</div>
          <div style={{ marginLeft: 'auto' }}>
            <Button onClick={remove}>X</Button>
          </div>
        </div>
      </div>}
    {children}
  </div>;

const ComponentList = () =>
  <div
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
  </div>;

export default (
  <Route
    path="/custom"
    component={compose(
      DragDropContext(HTML5Backend),
      withState('zones', 'setZones', ['GenesTable']),
    )(({ location, zones, setZones }) => {
      const { edit } = parse(location.search);
      return (
        <div
          style={{
            maxWidth: '1600px',
            padding: '85px 100px 90px',
          }}
        >
          {edit && <ComponentList />}
          <div style={{ marginLeft: edit ? 220 : 0 }}>
            <Link to={`${location.pathname}?edit=${edit ? '' : 1}`}>
              Toggle Edit
            </Link>
            {zones.map((type, i) => {
              const Component = Components[type];
              return (
                <Zone
                  key={i}
                  edit={edit}
                  type={type}
                  remove={() =>
                    setZones(zones => [
                      ...zones.slice(0, i),
                      ...zones.slice(i + 1),
                    ])}
                >
                  <Component />
                </Zone>
              );
            })}
            {edit && <EmptyZone setZones={setZones} />}
          </div>
        </div>
      );
    })}
  />
);
