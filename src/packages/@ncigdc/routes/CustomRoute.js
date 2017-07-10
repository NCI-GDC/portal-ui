/* @flow */

import React from 'react';
import { compose, withState } from 'recompose';
import { parse } from 'query-string';
import { Link } from 'react-router-dom';
import { handleActions } from 'redux-actions';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Route from 'react-router/Route';
import GeneSummary from '@ncigdc/modern_components/GeneSummary';
import GeneExternalReferences from '@ncigdc/modern_components/GeneExternalReferences';
import CancerDistributionBarChart from '@ncigdc/modern_components/CancerDistributionBarChart';
import CancerDistributionTable from '@ncigdc/modern_components/CancerDistributionTable';
import SsmsTable from '@ncigdc/modern_components/SsmsTable';
import { GeneLolliplot } from '@ncigdc/modern_components/Lolliplot';
import FullWidthLayout from '@ncigdc/components/Layouts/FullWidthLayout';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import CurrentFilters from '@ncigdc/components/CurrentFilters';
import ChartIcon from '@ncigdc/theme/icons/BarChart';
import GdcDataIcon from '@ncigdc/theme/icons/GdcData';
import { replaceFilters } from '@ncigdc/utils/filters';
import GeneSymbol from '@ncigdc/modern_components/GeneSymbol';

import { DragDropContext, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Components from '@ncigdc/modern_components';

import { DragSource } from 'react-dnd';

let dragging;

const cardSource = {
  beginDrag(props) {
    dragging = props.x;
    return {};
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

const squareTarget = {
  drop(props, monitor) {
    props.addZone(z => [...z, Components[dragging]]);
    dragging = null;
  },
};

function collectDrop(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
}

const ComponentBubble = DragSource('c', cardSource, collect)(props =>
  props.connectDragSource(
    <div
      style={{
        backgroundColor: props.isDragging ? 'rgb(18, 143, 182)' : 'white',
        borderRadius: 4,
        padding: '3px 5px',
        margin: 5,
        cursor: 'pointer',
      }}
    >
      {props.x}
    </div>,
  ),
);

const Zone = DropTarget('c', squareTarget, collectDrop)(props =>
  props.connectDropTarget(
    <div
      style={{
        color: props.isOver ? 'rgb(113, 204, 164)' : 'rgb(87, 87, 87)',
        border: '2px dotted',
        padding: 20,
      }}
    >
      + Insert Component
    </div>,
  ),
);

export default (
  <Route
    path="/custom"
    component={compose(
      DragDropContext(HTML5Backend),
      withState('zones', 'addZone', [Components.GenesTable]),
    )(p => {
      const { edit } = parse(p.location.search);
      return (
        <div
          style={{
            maxWidth: '1600px',
            padding: '85px 100px 90px',
          }}
        >
          {edit &&
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
              {Object.keys(Components).map(x =>
                <ComponentBubble key={x} x={x} />,
              )}
            </div>}
          <div style={{ marginLeft: edit ? 220 : 0 }}>
            <Link to={`${p.location.pathname}?edit=${edit ? '' : 1}`}>
              Toggle Edit
            </Link>
            {p.zones.map((X, zone) =>
              <div
                key={zone}
                style={{
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    zIndex: edit ? 10 : 0,
                    backgroundColor: edit
                      ? 'rgba(193, 255, 227, 0.3)'
                      : 'transparent',
                    width: '100%',
                    height: '100%',
                  }}
                />
                <X />
              </div>,
            )}
            {edit && <Zone addZone={p.addZone} />}
          </div>
        </div>
      );
    })}
  />
);
