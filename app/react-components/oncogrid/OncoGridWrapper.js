import React from 'react';
import { lifecycle, compose, withReducer } from 'recompose';
import OncoGrid from 'oncogrid';
import _ from 'lodash';

import Button from '../Button';
import Row from '../uikit/Flex/Row';
import { exitFullScreen, enterFullScreen } from '../utils/fullscreen';
import { StepLegend, SwatchLegend } from '../components/Legends';
import getQueries from './getQueries';
import SelectOverlay from './SelectOverlay';
import downloadSvg from '../utils/download-svg';
import oncoGridParams from './oncoGridParams';
import { gridReducer, initialGridState } from './gridReducer';

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
};

const OncoGridWrapper = ({
  gridState,
  dispatch,
  showOverlay = false,
  trackOptions = [],
  addTracksCallback,
  grid,
}) => (
  <div
    id="oncogrid-container"
    style={{ ...styles.container, ...(gridState.isFullScreen && styles.fullscreen) }}
  >
    <h5 style={{ textAlign: 'center' }}>OncoGrid - Top 50 Mutated Genes by High Impact Mutations</h5>
    {showOverlay &&
      <SelectOverlay
        options={trackOptions}
        callback={addTracksCallback}
      />
    }
    {grid &&
      <Row style={{ marginLeft: 0, minHeight: '70px' }}>
        <div style={{ flexGrow: 1 }}>
          {gridState.heatMapMode ? <StepLegend rightLabel="More Mutations" /> : <SwatchLegend colorMap={colorMap} />}
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
            onClick={() => dispatch({ type: 'reload', grid })}
          >
            <i className="fa fa-undo" /><span style={styles.hidden}>reload</span>
          </Button>
          <Button
            style={styles.button}
            onClick={() => grid.cluster()}
          >
            <i className="fa fa-sort-amount-desc" /><span style={styles.hidden}>sort</span>
          </Button>
          <Button
            style={{ ...styles.button, ...(gridState.heatMapMode && styles.buttonActive) }}
            onClick={() => dispatch({ type: 'toggleHeatmap', grid })}
          >
            <i className="fa fa-fire" /><span style={styles.hidden}>toggle heatmap</span>
          </Button>
          <Button
            style={{ ...styles.button, ...(gridState.gridActive && styles.buttonActive) }}
            onClick={() => dispatch({ type: 'toggleGridLines', grid })}
          >
            <i className="fa fa-th" /><span style={styles.hidden}>toggle grid lines</span>
          </Button>
          <Button
            style={{ ...styles.button, ...(gridState.crosshairMode && styles.buttonActive) }}
            onClick={() => dispatch({ type: 'toggleCrosshair', grid })}
          >
            <i className="fa fa-crosshairs" /><span style={styles.hidden}>toggle crosshair mode</span>
          </Button>
          <Button
            style={{ ...styles.button, ...(gridState.isFullScreen && styles.buttonActive) }}
            onClick={() => {
              if (gridState.isFullScreen) {
                exitFullScreen();
                dispatch({ type: 'reload', 
                 });
              } else {
                enterFullScreen(document.querySelector('#oncogrid-container'));
                grid.resize(screen.width - 400, screen.height - 400, true);
              }

              dispatch({ type: 'updateFullScreen', grid });
            }}
          >
            <i className="fa fa-arrows-h" /><span style={styles.hidden}>toggle fullscreen</span>
          </Button>

          {gridState.crosshairMode &&
            <div style={{ fontSize: '1.1rem', verticalAlign: 'top' }}>
              Click and drag to select a region on the OncoGrid to zoom in.
            </div>
          }
        </span>
      </Row>
    }
    {!grid &&
      <div style={{ width: '50%' }}>
        No result found.<br />
        Please note that the analysis is filtering on high impact mutations only.<br />
        Please change your donor or gene set and run the analysis again.
      </div>
    }

    <div id={GRID_ID} style={{ cursor: gridState.crosshairMode ? 'crosshair' : 'pointer' }} />
  </div>
);

OncoGridWrapper.propTypes = {
  gridState: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  showOverlay: React.PropTypes.bool,
  trackOptions: React.PropTypes.array,
  addTracksCallback: React.PropTypes.func,
  grid: React.PropTypes.object,
};

const enhance = compose(
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { grid, gridPadding, gridHeight, gridContainer } = this.state;
      grid.resize(gridContainer.offsetWidth - gridPadding, gridHeight);
    },
    componentDidMount() {
      const { projectId, esHost } = this.props;
      getQueries(projectId, esHost)
        .then((responses) => {
          const container = document.querySelector('#oncogrid-container');
          const height = 150;
          const padding = 306;

          const gridParams = oncoGridParams({
            colorMap,
            clickHandlers,
            element: `#${GRID_ID}`,
            donorData: responses.cases,
            geneData: responses.genes,
            occurencesData: responses.occurences,
            width: container.offsetWidth - padding,
            height: height,
            addTrackFunc: (tracks, callback) => {
              this.setState({
                showOverlay: true,
                trackOptions: tracks,
                addTracksCallback: (selectedTracks) => {
                  callback(selectedTracks);
                  this.setState({
                    showOverlay: false,
                  });
                },
              });
            },
          });

          if (gridParams) {
            const grid = new OncoGrid(gridParams);
            grid.render();

            this.setState({
              grid,
              gridHeight: height,
              gridPadding: padding,
              gridContainer: container,
            });

            document.querySelector('.og-tooltip-oncogrid').style.transform = 'translateY(-110px)'; // TODO: fix tooltip position inside oncogrid and remove this line 
          }
        });
    },
  }),
  withReducer('gridState', 'dispatch', gridReducer, initialGridState)
);

export default (enhance(OncoGridWrapper));
