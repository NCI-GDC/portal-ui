/* @flow */
import React from 'react';
import { lifecycle, compose, withState, withProps } from 'recompose';
import OncoGrid from 'oncogrid';
import { uniqueId } from 'lodash';

import Button from '../uikit/Button';
import Row from '../uikit/Flex/Row';
import { exitFullScreen, enterFullScreen, isFullScreen } from '../utils/fullscreen';
import { StepLegend, SwatchLegend } from '../components/Legends';
import getQueries from './getQueries';
import SelectOverlay from '../components/SelectOverlay';
import oncoGridParams from './oncoGridParams';
import DownloadVisualizationButton from '../components/DownloadVisualizationButton';
import ToolTip from '../uikit/Tooltip';
import { visualizingButton } from '../theme/mixins';

const GRID_CLASS = 'oncogrid-wrapper';

const consequenceTypes = {
  missense_variant: '#ff9b6c',
  frameshift_variant: '#57dba4',
  start_lost: '#ff2323',
  stop_lost: '#d3ec00',
  initiator_codon_variant: '#5abaff',
  stop_gained: '#af57db',
};

const styles = {
  container: {
    overflow: 'visible',
    padding: '0 10px',
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
    ...visualizingButton,
    marginBottom: 12,
  },
  buttonActive: {
    backgroundColor: '#e6e6e6',
    borderColor: '#adadad',
  },
  hidden: {
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
};

const OncoGridWrapper = ({
  trackOptions,
  addTracksCallback,
  oncoGrid,
  oncoGridData,
  oncoGridContainer,
  setOncoGridContainer,
  heatMapMode,
  setHeatMapMode,
  showGridLines,
  setShowGridLines,
  crosshairMode,
  setCrosshairMode,
  refreshGridState,
  setOncoGridWrapper,
  uniqueGridClass,
  isLoading,
}) => (
  <div
    style={{ ...styles.container, ...(isFullScreen() && styles.fullscreen) }}
    ref={setOncoGridContainer}
  >
    <h5 style={{ textAlign: 'center' }}>Top 50 Mutated Genes by High Impact Mutations</h5>
    {trackOptions && trackOptions.length && addTracksCallback &&
      <SelectOverlay
        options={trackOptions}
        callback={addTracksCallback}
      />
    }
    {oncoGridData && !isLoading &&
      <Row style={{ marginLeft: 0, minHeight: '70px' }}>
        <div style={{ flexGrow: 1 }}>
          {heatMapMode ? <StepLegend rightLabel="More Mutations" /> : <SwatchLegend colorMap={consequenceTypes} />}
        </div>
        <span>
          <DownloadVisualizationButton
            svg={`.${uniqueGridClass} svg`}
            data={oncoGridData}
            stylePrefix={`.${GRID_CLASS}`}
            slug="oncogrid"
            noText
            tooltipHTML="Download OncoGrid data or image"
          />
          <ToolTip innerHTML="Reload grid">
            <Button
              style={styles.button}
              onClick={() => {
                oncoGrid.reload();
                refreshGridState();
              }}
            ><i className="fa fa-undo" /><span style={styles.hidden}>Reload</span></Button>
          </ToolTip>
          <ToolTip innerHTML="Cluster Data">
            <Button
              style={styles.button}
              onClick={() => oncoGrid.cluster()}
            ><i className="fa fa-sort-amount-desc" /><span style={styles.hidden}>Cluster</span></Button>
          </ToolTip>
          <ToolTip innerHTML="Toggle heatmap view">
            <Button
              style={{ ...styles.button, ...(heatMapMode && styles.buttonActive) }}
              onClick={() => setHeatMapMode(!heatMapMode)}
            ><i className="fa fa-fire" /><span style={styles.hidden}>Heatmap</span></Button>
          </ToolTip>
          <ToolTip innerHTML="Toggle gridlines">
            <Button
              style={{ ...styles.button, ...(showGridLines && styles.buttonActive) }}
              onClick={() => setShowGridLines(!showGridLines)}
            ><i className="fa fa-th" /><span style={styles.hidden}>Lines</span></Button>
          </ToolTip>
          <ToolTip innerHTML="Toggle crosshairs">
            <Button
              style={{ ...styles.button, ...(crosshairMode && styles.buttonActive) }}
              onClick={() => setCrosshairMode(!crosshairMode)}
            ><i className="fa fa-crosshairs" /><span style={styles.hidden}>Crosshair</span></Button>
          </ToolTip>
          <ToolTip innerHTML="Fullscreen">
            <Button
              style={{
                ...styles.button,
                ...(isFullScreen() && styles.buttonActive),
                marginRight: 0,
              }}
              onClick={() => {
                if (isFullScreen()) {
                  exitFullScreen();
                  oncoGrid.reload();
                  refreshGridState();
                } else {
                  enterFullScreen(oncoGridContainer);
                  oncoGrid.resize(screen.width - 400, screen.height - 400, true);
                }
              }}
            ><i className="fa fa-arrows-h" /><span style={styles.hidden}>Fullscreen</span></Button>
          </ToolTip>

          {crosshairMode &&
            <div style={{ fontSize: '1.1rem', verticalAlign: 'top' }}>
              Click and drag to select a region on the OncoGrid to zoom in.
            </div>
          }
        </span>
      </Row>
    }
    {!oncoGridData && !isLoading &&
      <div style={{ width: '50%' }}>
        No result found.<br />
        Please note that the analysis is filtering on high impact mutations only.<br />
        Please change your donor or gene set and run the analysis again.
      </div>
    }

    {isLoading && <div style={{ padding: 10, textAlign: 'center' }}>Loading OncoGrid...</div>}

    <div
      className={`${GRID_CLASS} ${uniqueGridClass}`}
      ref={setOncoGridWrapper}
      style={{
        cursor: crosshairMode ? 'crosshair' : 'pointer',
        visibility: isLoading ? 'hidden' : 'visible',
      }}
    />
  </div>
);

const enhance = compose(
  withState('oncoGrid', 'setOncoGrid', null),
  withState('oncoGridData', 'setOncoGridData', {}),
  withState('oncoGridContainer', 'setOncoGridContainer', null),
  withState('oncoGridWrapper', 'setOncoGridWrapper', null),
  withState('trackOptions', 'setTrackOptions', []),
  withState('addTracksCallback', 'setAddTracksCallback', null),
  withState('crosshairMode', 'setCrosshairMode', false),
  withState('showGridLines', 'setShowGridLines', false),
  withState('heatMapMode', 'setHeatMapMode', false),
  withState('isLoading', 'setIsLoading', true),
  withProps({ oncoGridHeight: 150, oncoGridPadding: 306 }),
  lifecycle({
    getInitialState() {
      return {
        uniqueGridClass: GRID_CLASS + uniqueId(),
        refreshGridState: () => {
          const { oncoGrid, setHeatMapMode, setShowGridLines, setCrosshairMode } = this.props;
          setHeatMapMode(oncoGrid.heatMapMode);
          setShowGridLines(oncoGrid.drawGridLines);
          setCrosshairMode(oncoGrid.crosshairMode);
        },
      };
    },
    componentWillReceiveProps(nextProps) {
      const {
        crosshairMode: lastCrosshairMode,
        showGridLines: lastShowGridLines,
        heatMapMode: lastHeadMapMode,
        width: lastWidth,
      } = this.props;

      const {
        oncoGrid,
        oncoGridPadding,
        oncoGridHeight,
        oncoGridContainer,
        crosshairMode,
        showGridLines,
        heatMapMode,
        width,
      } = nextProps;

      if (oncoGrid) {
        if (lastCrosshairMode !== crosshairMode) oncoGrid.toggleCrosshair();
        if (lastShowGridLines !== showGridLines) oncoGrid.toggleGridLines();
        if (lastHeadMapMode !== heatMapMode) oncoGrid.toggleHeatmap();
        if (width !== lastWidth) oncoGrid.resize(oncoGridContainer.offsetWidth - oncoGridPadding, oncoGridHeight);
      }
    },
    componentDidMount() {
      const { projectId, esHost, esIndexVersion } = this.props;
      getQueries(projectId, esHost, esIndexVersion)
        .then((responses) => {
          const {
            setOncoGrid,
            setOncoGridData,
            setTrackOptions,
            setAddTracksCallback,
            oncoGridPadding,
            oncoGridHeight,
            oncoGridContainer,
            oncoGridWrapper,
            setIsLoading,
          } = this.props;

          const gridParams = oncoGridParams({
            colorMap: consequenceTypes,
            element: oncoGridWrapper,
            donorData: responses.cases,
            geneData: responses.genes,
            occurencesData: responses.occurences,
            width: oncoGridContainer.offsetWidth - oncoGridPadding,
            height: oncoGridHeight,
            addTrackFunc: (trackOptions, callback) => {
              setAddTracksCallback(() => (tracks) => tracks && callback(tracks) && setAddTracksCallback(null));
              setTrackOptions(trackOptions);
            },
            consequenceTypes: Object.keys(consequenceTypes),
          });

          if (gridParams) {
            const grid = new OncoGrid(gridParams);
            grid.render();
            setOncoGrid(grid);
            setOncoGridData(responses);
            this.state.refreshGridState();
          }

          setIsLoading(false);
        });
    },
  })
);

export default (enhance(OncoGridWrapper));
