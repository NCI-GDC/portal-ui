import React from 'react';
import { lifecycle, compose, withReducer } from 'recompose';
import OncoGrid from 'oncogrid';
import _ from 'lodash';

import Button from '../uikit/Button';
import Row from '../uikit/Flex/Row';
import { exitFullScreen, enterFullScreen } from '../utils/fullscreen';
import { StepLegend, SwatchLegend } from '../components/Legends';
import getQueries from './getQueries';
import SelectOverlay from './SelectOverlay';
import oncoGridParams from './oncoGridParams';
import { gridReducer, initialGridState } from './gridReducer';
import DownloadVisualizationButton from '../components/DownloadVisualizationButton'
import ToolTip from '../uikit/Tooltip';

const GRID_ID = 'oncogrid-div';

const consequenceTypes = {
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
    margin: '0 12px 12px 0',
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
  },
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
    window.location = `/genes/${g.id}`;
  },

  donorClick: function (d) {
    window.location = `/cases/${d.id}`;
  },
};

const OncoGridWrapper = ({
  gridState,
  dispatch,
  showOverlay = false,
  trackOptions = [],
  addTracksCallback,
  grid,
  gridData,
}) => (
  <div
    id="oncogrid-container"
    style={{ ...styles.container, ...(gridState.isFullScreen && styles.fullscreen) }}
  >
    <h5 style={{ textAlign: 'center' }}>Top 50 Mutated Genes by High Impact Mutations</h5>
    {showOverlay &&
      <SelectOverlay
        options={trackOptions}
        callback={addTracksCallback}
      />
    }
    {grid &&
      <Row style={{ marginLeft: 0, minHeight: '70px' }}>
        <div style={{ flexGrow: 1 }}>
          {gridState.heatMapMode ? <StepLegend rightLabel="More Mutations" /> : <SwatchLegend colorMap={consequenceTypes} />}
        </div>
        <span>
          <DownloadVisualizationButton
            svg={`#${GRID_ID} svg`}
            data={gridData}
            stylePrefix={`#${GRID_ID}`}
            slug="oncogrid"
            noText={true}
            tooltipHTML="Download OncoGrid data or image"
          />
          <ToolTip innerHTML="Reload grid">
            <Button
              style={styles.button}
              onClick={() => dispatch({ type: 'reload', grid })}
            ><i className="fa fa-undo" /><span style={styles.hidden}>Reload</span></Button>
          </ToolTip>
          <ToolTip innerHTML="Cluster Data">
            <Button
              style={styles.button}
              onClick={() => grid.cluster()}
            ><i className="fa fa-sort-amount-desc" /><span style={styles.hidden}>Cluster</span></Button>
          </ToolTip>
          <ToolTip innerHTML="Toggle heatmap view">
            <Button
              style={{ ...styles.button, ...(gridState.heatMapMode && styles.buttonActive) }}
              onClick={() => dispatch({ type: 'toggleHeatmap', grid })}
            ><i className="fa fa-fire" /><span style={styles.hidden}>Heatmap</span></Button>
          </ToolTip>
          <ToolTip innerHTML="Toggle gridlines">
            <Button
              style={{ ...styles.button, ...(gridState.gridActive && styles.buttonActive) }}
              onClick={() => dispatch({ type: 'toggleGridLines', grid })}
            ><i className="fa fa-th" /><span style={styles.hidden}>Lines</span></Button>
          </ToolTip>
          <ToolTip innerHTML="Toggle crosshairs">
            <Button
              style={{ ...styles.button, ...(gridState.crosshairMode && styles.buttonActive) }}
              onClick={() => dispatch({ type: 'toggleCrosshair', grid })}
            ><i className="fa fa-crosshairs" /><span style={styles.hidden}>Crosshair</span></Button>
          </ToolTip>
          <ToolTip innerHTML="Fullscreen">
            <Button
              style={{ ...styles.button, ...(gridState.isFullScreen && styles.buttonActive) }}
              onClick={() => {
                if (gridState.isFullScreen) {
                  exitFullScreen();
                  dispatch({ type: 'reload', grid });
                } else {
                  enterFullScreen(document.querySelector('#oncogrid-container'));
                  grid.resize(screen.width - 400, screen.height - 400, true);
                }

                dispatch({ type: 'updateFullScreen', grid });
              }}
            ><i className="fa fa-arrows-h" /><span style={styles.hidden}>Fullscreen</span></Button>
          </ToolTip>

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
    getInitialState() {
      return {};
    },
    componentWillReceiveProps(nextProps) {
      const { grid, gridPadding, gridHeight, gridContainer } = this.state;

      if(grid) {
        grid.resize(gridContainer.offsetWidth - gridPadding, gridHeight);
      }
    },
    componentDidMount() {
      const { projectId, esHost, esIndexVersion } = this.props;

      getQueries(projectId, esHost, esIndexVersion)
        .then((responses) => {
          const container = document.querySelector('#oncogrid-container');
          const height = 150;
          const padding = 306;

          const gridParams = oncoGridParams({
            colorMap: consequenceTypes,
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
                  if(selectedTracks) {
                    callback(selectedTracks);
                  }

                  this.setState({
                    showOverlay: false,
                  });
                },
              });
            },
            consequenceTypes: Object.keys(consequenceTypes),
          });

          if (gridParams) {
            const grid = new OncoGrid(gridParams);
            grid.render();

            this.setState({
              grid,
              gridData: {
                cases: gridParams.donors,
                genes: gridParams.genes,
                observations: gridParams.observations,
              },
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
