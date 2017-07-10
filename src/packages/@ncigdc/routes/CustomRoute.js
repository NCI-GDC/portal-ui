/* @flow */

import React from 'react';
import { compose, withState } from 'recompose';
import { Link } from 'react-router-dom';
import { parse } from 'query-string';
import Route from 'react-router/Route';
import { DragDropContext, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Button from '@ncigdc/uikit/Button';
import { Row, Column } from '@ncigdc/uikit/Flex';

import Components from '@ncigdc/modern_components';

import { DragSource } from 'react-dnd';

let draggingType;

const typeSource = {
  beginDrag(props) {
    draggingType = props.type;
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
    props.setZones(z => [...z, { type: draggingType, userProps: {} }]);
    draggingType = null;
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

const Zone = ({ edit, children, component, remove, style }) =>
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

const ComponentList = ({ pathname, edit }) =>
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

export default (
  <Route
    path="/custom"
    component={compose(
      DragDropContext(HTML5Backend),
      withState('zones', 'setZones', [
        {
          type: 'GenesTable',
          userProps: {},
        },
      ]),
    )(({ location, zones, setZones }) => {
      const { edit } = parse(location.search);
      return (
        <div
          style={{
            maxWidth: '1600px',
            padding: '85px 100px 90px',
          }}
        >
          {edit && <ComponentList pathname={location.pathname} edit={edit} />}
          <div style={{ marginLeft: edit ? 220 : 0 }}>
            <Column spacing="2rem">
              {zones.map((component, i) => {
                const Component = Components[component.type];
                return (
                  <Zone
                    key={i}
                    edit={edit}
                    component={component}
                    remove={() =>
                      setZones(zones => [
                        ...zones.slice(0, i),
                        ...zones.slice(i + 1),
                      ])}
                  >
                    <Component {...component.userProps} />
                  </Zone>
                );
              })}
            </Column>
            {edit &&
              <div style={{ marginTop: '2rem' }}>
                <EmptyZone setZones={setZones} />
              </div>}
          </div>
        </div>
      );
    })}
  />
);
