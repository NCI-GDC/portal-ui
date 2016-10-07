import React from 'react';
import { lifecycle, compose, withReducer } from 'recompose';
import _ from 'lodash';

import Button from './Button';
import Row from './uikit/Flex/Row';
import oncoGridController from './utils/oncoGridController';
import {isFullScreen, exitFullScreen, enterFullScreen} from './utils/fullscreen';

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
  },
  td: {
    padding: 6,
  },
  cell: {
    paddingTop: 4,
    paddingBottom: 4,
  }
};

const HeatMap = () => (
  <table className="onco-table">
    <tbody>
      <tr>
        <td style={styles.td}>Less</td>
        <td style={styles.td}>
          <div className="onco-legend-square" style={{background:'#D33682', opacity: 0.25}}></div>
          <div className="onco-legend-square" style={{background:'#D33682', opacity: 0.50}}></div>
          <div className="onco-legend-square" style={{background:'#D33682', opacity: 0.75}}></div>
          <div className="onco-legend-square" style={{background:'#D33682', opacity: 1}}></div>
        </td>
        <td style={styles.td}>More Mutations</td>
      </tr>
    </tbody>
  </table>
);

const Legend = () => (
  <table className="onco-table">
    <tbody>
      <tr>
        <td style={styles.td}>
          <div style={styles.cell}>
            <div className="onco-legend-square" style={{background:'#ff9b6c'}}></div>
            <small>missense variant</small>
          </div>

          <div style={styles.cell}>
            <div className="onco-legend-square" style={{background:'#57dba4'}}></div>
            <small>frameshift variant</small>
          </div>
        </td>
        
        <td style={styles.td}>
          <div style={styles.cell}>
            <div className="onco-legend-square" style={{background:'#ff2323'}}></div>
            <small>start lost</small>
          </div>

          <div style={styles.cell}>
            <div className="onco-legend-square" style={{background:'#d3ec00'}}></div>
            <small>stop lost</small>
          </div>
        </td>

        <td style={styles.td}>
          <div style={styles.cell}>
            <div className="onco-legend-square" style={{background:'#5abaff'}}></div>
            <small>initiator codon variant</small>
          </div>

          <div style={styles.cell}>
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
    {!oncoGridController.hasNoData &&
      <Row style={{ marginLeft: 0, minHeight: '70px' }}>
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
                enterFullScreen(document.querySelector('#oncogrid-container'));
                oncoGridController.resize(screen.width - 400, screen.height - 400, true);
              }

              dispatch({type: 'updateFullScreen'})
            }}
          >
            <i className="fa fa-arrows-h"></i>
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

    <div id="oncogrid-div" style={{cursor: gridState.crosshairMode ? 'crosshair' : 'pointer'}}/>
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
      oncoGridController.init();
      this.forceUpdate();
    }
  }),
  withReducer('gridState', 'dispatch', gridReducer, initialGridState)
);

export default (enhance(OncoGridWrapper));
