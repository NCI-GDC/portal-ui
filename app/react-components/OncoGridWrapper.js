import React from 'react';
import { lifecycle, compose, withReducer } from 'recompose';
import _ from 'lodash';

import Button from './Button';
import Row from './uikit/Flex/Row.js';
import oncoGridController from './utils/oncoGridController.js';

const styles = {
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
  }
};

function cleanActives() {
  // $('#oncogrid-controls').show();
  // $('#oncogrid-no-data').hide();
  // $('#og-crosshair-message').hide();
};

function isFullScreen() {
  return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
}

function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
};

function enterFullScreen() {
  const element = document.querySelector('#oncogrid-container');

  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
  }
};

const HeatMap = () => (
  <table id="og-heatmap-legend" className="onco-table">
    <tbody>
      <tr>
        <td>Less</td>
        <td>
          <div className="onco-legend-square" style={{background:'#D33682', opacity: 0.25}}></div>
          <div className="onco-legend-square" style={{background:'#D33682', opacity: 0.50}}></div>
          <div className="onco-legend-square" style={{background:'#D33682', opacity: 0.75}}></div>
          <div className="onco-legend-square" style={{background:'#D33682', opacity: 1}}></div>
        </td>
        <td>More Mutations</td>
      </tr>
    </tbody>
  </table>
);

const Legend = () => (
  <table id="og-variant-legend" className="onco-table">
    <tbody>
      <tr>
        <td>
          <div>
            <div className="onco-legend-square" style={{background:'#ff9b6c'}}></div>
            <small>missense variant</small>
          </div>

          <div>
            <div className="onco-legend-square" style={{background:'#57dba4'}}></div>
            <small>frameshift variant</small>
          </div>
        </td>
        
        <td>
          <div>
            <div className="onco-legend-square" style={{background:'#ff2323'}}></div>
            <small>start lost</small>
          </div>

          <div>
            <div className="onco-legend-square" style={{background:'#d3ec00'}}></div>
            <small>stop lost</small>
          </div>
        </td>

        <td>
          <div>
            <div className="onco-legend-square" style={{background:'#5abaff'}}></div>
            <small>initiator codon variant</small>
          </div>

          <div>
            <div className="onco-legend-square" style={{background:'#af57db'}}></div>
            <small>stop gained</small>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
);

const OncoGridWrapper = ({gridState, dispatch}) => (
  <div id="oncogrid-container">
    <Row id="oncogrid-controls" className="og-grid-align">
      <div style={{flexGrow: 1}}>
        {gridState.heatMapMode ? <HeatMap /> : <Legend />}
      </div>
      <span>
        <Button
          style={styles.button}
          onClick={() => dispatch({type: 'reload'})}
        >
          <i className="fa fa-undo"></i>
        </Button>
        <Button
          style={styles.button}
          onClick={() => oncoGridController.cluster()}
        >
          <i className="fa fa-sort-amount-desc"></i>
        </Button>
        <Button
          style={gridState.heatMapMode ? {...styles.button, ...styles.buttonActive} : styles.button}
          onClick={() => dispatch({type: 'toggleHeatmap'})}
        >
          <i className="fa fa-fire"></i>
        </Button>
        <Button
          style={gridState.gridActive ? {...styles.button, ...styles.buttonActive} : styles.button}
          onClick={() => dispatch({type: 'toggleGridLines'})}
        >
          <i className="fa fa-th"></i>
        </Button>
        <Button
          style={gridState.crosshairMode ? {...styles.button, ...styles.buttonActive} : styles.button}
          onClick={() => dispatch({type: 'toggleCrosshair'})}
        >
          <i className="fa fa-crosshairs"></i>
        </Button>
        <Button
          style={gridState.isFullScreen ? {...styles.button, ...styles.buttonActive} : styles.button}
          onClick={() => {
            if (gridState.isFullScreen) {
              exitFullScreen();
              dispatch({type: 'reload'});
            } else {
              enterFullScreen();
              oncoGridController.resize(screen.width - 400, screen.height - 400, true);
            }

            dispatch({type: 'updateFullScreen'})
          }}
        >
          <i className="fa fa-arrows-h"></i>
        </Button>
      </span>
    </Row>

    <div id="oncogrid-div" className={gridState.crosshairMode ? 'og-crosshair-mode' : 'og-pointer-mode'}/>
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
      // cleanActives();

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
  lifecycle({ componentDidMount() { oncoGridController.init(); } }),
  withReducer('gridState', 'dispatch', gridReducer, initialGridState)
);

export default (enhance(OncoGridWrapper));
