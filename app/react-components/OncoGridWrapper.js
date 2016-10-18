import React from 'react';
import { lifecycle, compose, withReducer } from 'recompose';
import _ from 'lodash';

import Button from './Button';
import Row from './uikit/Flex/Row';
import Column from './uikit/Flex/Column';
import oncoGridController from './utils/oncoGridController';
import {isFullScreen, exitFullScreen, enterFullScreen} from './utils/fullscreen';

const GRID_ID = 'oncogrid-div';

const colorMap = {
  'missense_variant': '#ff9b6c',
  'frameshift_variant': '#57dba4',
  'start_lost': '#ff2323',
  'stop_lost': '#d3ec00',
  'initiator_codon_variant': '#5abaff',
  'stop_gained': '#af57db',
};

const styles = {
  container: {
    overflow: 'visible',
    maxWidth: 900,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  fullscreen: {
    maxWidth: '100%',
    width: '100%',
    marginLeft: 0,
    padding: '100px 100px 0',
    overflow: 'scroll',
    height: '100%',
  },
  button: {
    color: '#333',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    marginRight: 12,
    minWidth: 46,
    minHeight: 34,
    display: 'inline-flex',
  },
  buttonActive: {
    backgroundColor: '#e6e6e6',
    borderColor: '#adadad',
  },
  td: {
    padding: 6,
  },
  cell: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  hidden: {
    width: 0,
    height: 0,
    overflow: 'hidden',
  }
};

const clickHandlers = {
  donorHistogramClick: function (d) {
    console.log('donorHistogramClick');
  },

  gridClick: function (o) {
    console.log('gridClick');
  },

  geneHistogramClick: function (g) {
    console.log('geneHistogramClick');
  },

  geneClick: function (g) {
    console.log('geneClick'); // go to gene page
  },

  donorClick: function (d) {
    console.log('donorClick') // go to case page
  },
}

const HeatMap = () => (
  <Row className="onco-table">
    <Column style={styles.td}>Less</Column>
    <Row style={styles.td}>
      {
        [0.25, 0.5, 0.75, 1]
          .map((opacity) => (
            <div className="onco-legend-square" style={{background:'#D33682', opacity: opacity}} key={opacity}></div>
          ))
      }
    </Row>
    <Column style={styles.td}>More Mutations</Column>
  </Row>
);

const Legend = () => {
  const labels = _.map(colorMap, (color, key) => (
    <div style={styles.cell} key={key}>
      <div className="onco-legend-square" style={{background: color}}></div>
      <span>{key.replace(/_/g, ' ')}</span>
    </div>
  ));

  return (
    <Row className="onco-table">
      <Column style={styles.td}>{labels.slice(0, 2)}</Column>
      <Column style={styles.td}>{labels.slice(2, 4)}</Column>
      <Column style={styles.td}>{labels.slice(4, 6)}</Column>
    </Row>
  );
};

const OncoGridWrapper = ({gridState, dispatch}) => (
  <div
    id="oncogrid-container"
    style={gridState.isFullScreen ? {...styles.container, ...styles.fullscreen} : styles.container}
  >
    {!oncoGridController.hasNoData &&
      <Row style={{ marginLeft: 0, minHeight: '70px' }}>
        <div style={{flexGrow: 1}}>
          {gridState.heatMapMode ? <HeatMap /> : <Legend />}
        </div>
        <span>
          <Button
            style={styles.button}
            onClick={
              () => {
                downloadSvg({
                  svg: document.querySelector(`#${GRID_ID} svg`),
                  stylePrefix: `#${GRID_ID}`,
                  fileName: 'grid.svg',
                });
              }
            }
          >
            <i className="fa fa-download" /><span style={styles.hidden}>reload</span>
          </Button>
          <Button
            style={styles.button}
            onClick={() => dispatch({ type: 'reload' })}
          >
            <i className="fa fa-undo"></i><span style={styles.hidden}>reload</span>
          </Button>
          <Button
            style={styles.button}
            onClick={() => oncoGridController.cluster()}
          >
            <i className="fa fa-sort-amount-desc"></i><span style={styles.hidden}>sort</span>
          </Button>
          <Button
            style={gridState.heatMapMode ? {...styles.button, ...styles.buttonActive} : styles.button}
            onClick={() => dispatch({type: 'toggleHeatmap'})}
          >
            <i className="fa fa-fire"></i><span style={styles.hidden}>toggle heatmap</span>
          </Button>
          <Button
            style={gridState.gridActive ? {...styles.button, ...styles.buttonActive} : styles.button}
            onClick={() => dispatch({type: 'toggleGridLines'})}
          >
            <i className="fa fa-th"></i><span style={styles.hidden}>toggle grid lines</span>
          </Button>
          <Button
            style={gridState.crosshairMode ? {...styles.button, ...styles.buttonActive} : styles.button}
            onClick={() => dispatch({type: 'toggleCrosshair'})}
          >
            <i className="fa fa-crosshairs"></i><span style={styles.hidden}>toggle crosshair mode</span>
          </Button>
          <Button
            style={gridState.isFullScreen ? {...styles.button, ...styles.buttonActive} : styles.button}
            onClick={() => {
              if (gridState.isFullScreen) {
                exitFullScreen();
                dispatch({type: 'reload'});
              } else {
                enterFullScreen(document.querySelector('#oncogrid-container'));
                oncoGridController.resize(screen.width - 400, screen.height - 400, true);
              }

              dispatch({type: 'updateFullScreen'})
            }}
          >
            <i className="fa fa-arrows-h"></i><span style={styles.hidden}>toggle fullscreen</span>
          </Button>

          {gridState.crosshairMode &&
            <div style={{ fontSize: '1.1rem', verticalAlign: 'top' }}>
              Click and drag to select a region on the OncoGrid to zoom in.
            </div>
          }
        </span>
      </Row>
    }
    {oncoGridController.hasNoData &&
      <div style={{ width: '50%' }}>
        No result found.<br />
        Please note that the analysis is filtering on high impact mutations only.<br />
        Please change your donor or gene set and run the analysis again.
      </div>
    }

    <div id={GRID_ID} style={{cursor: gridState.crosshairMode ? 'crosshair' : 'pointer'}}/>
  </div>
);

const gridReducer = (gridState, action) => {
  switch (action.type) {
    case 'toggleCrosshair':
      oncoGridController.toggleCrosshair();
      break;
    case 'toggleGridLines':
      oncoGridController.toggleGridLines();
      break;
    case 'toggleHeatmap':
      oncoGridController.toggleHeatmap();
      break;
    case 'reload':
      oncoGridController.reload();

      if (isFullScreen()) {
        setTimeout(function () {
          oncoGridController.resize(screen.width - 400, screen.height - 400, true);
        }, 0);
      }
      break;
  }

  return {
    ...gridState,
    heatMapMode: oncoGridController.heatMapMode,
    gridActive: oncoGridController.gridActive,
    crosshairMode: oncoGridController.crosshairMode,
    isFullScreen: isFullScreen(),
  };
}

const initialGridState = {
  heatMapMode: false,
  gridActive: true,
  crosshairMode: false,
  isFullScreen: isFullScreen(),
};

const enhance = compose(
  lifecycle({
    componentDidMount() {
      oncoGridController.init({
        colorMap,
        clickHandlers,
        element: `#${GRID_ID}`,
      });

      this.forceUpdate();
    }
  }),
  withReducer('gridState', 'dispatch', gridReducer, initialGridState)
);

export default (enhance(OncoGridWrapper));
