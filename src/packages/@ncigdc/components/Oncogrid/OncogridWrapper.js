/* @flow */
/* eslint
no-restricted-globals: 0
*/
import React from 'react';
import { lifecycle, compose, withState, withProps, mapProps } from 'recompose';
import OncoGrid from 'oncogrid';
import { uniqueId, get, debounce } from 'lodash';
import { connect } from 'react-redux';
import withSize from '@ncigdc/utils/withSize';
import FullScreenIcon from 'react-icons/lib/md/fullscreen';

import {
  exitFullScreen,
  enterFullScreen,
  isFullScreen,
} from '@ncigdc/utils/fullscreen';
import { getFilterValue, replaceFilters } from '@ncigdc/utils/filters';
import {
  consequenceTypes,
  colorMap,
  cnvChangeTypes,
} from '@ncigdc/utils/filters/prepared/significantConsequences';
import withRouter from '@ncigdc/utils/withRouter';

import Loader from '@ncigdc/uikit/Loaders/Loader';
import Button from '@ncigdc/uikit/Button';
import { Row, Column } from '@ncigdc/uikit/Flex';
import { Tooltip } from '@ncigdc/uikit/Tooltip';

import { ToggleSwatchLegend } from '@ncigdc/components/Legends';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import Hidden from '@ncigdc/components/Hidden';

import { visualizingButton } from '@ncigdc/theme/mixins';
import wrapSvg from '@ncigdc/utils/wrapSvg';
import { performanceTracker } from '@ncigdc/utils/analytics';
import { withTooltip } from '@ncigdc/uikit/Tooltip/index';

import getQueries from './getQueries';
import oncoGridParams from './oncoGridParams';
import mouseEvents from './mouseEvents';

import './oncogrid.css';

function refreshGridState({
  oncoGrid,
  setHeatMapMode,
  setShowGridLines,
  setCrosshairMode,
  setIsLoading,
}: {
  oncoGrid: Object,
  setHeatMapMode: Function,
  setShowGridLines: Function,
  setCrosshairMode: Function,
  setIsLoading: Function,
}): void {
  setIsLoading(true);
  oncoGrid.container.node().style.visibility = 'hidden';
  setHeatMapMode(oncoGrid.heatMapMode);
  setShowGridLines(oncoGrid.drawGridLines);
  setCrosshairMode(oncoGrid.crosshairMode);
}

const GRID_CLASS = 'oncogrid-wrapper';
const MAX_CASES = 200;
const MAX_GENES = 50;

const styles = {
  container: {
    overflow: 'visible',
    padding: '0 30px',
    background: 'white',
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
};

const containerRefs = {};
const wrapperRefs = {};

type TProps = {
  oncoGrid: Object,
  setOncoGrid: Function,
  setOncoGridData: Function,
  oncoGridPadding: number,
  oncoGridHeight: number,
  setIsLoading: Function,
  projectId: string,
  setHeatMapMode: Function,
  setShowGridLines: Function,
  setCrosshairMode: Function,
  setTrackLegends: Function,
  currentFilters: Object,
  uniqueGridClass: string,
  dispatch: Function,
  push: Function,
  impacts: Array<string>,
  filteredConsequenceTypes: Array<string>,
};

const OncoGridWrapper = compose(
  withRouter,
  withState('oncoGrid', 'setOncoGrid', {}),
  withState('oncoGridData', 'setOncoGridData', null),
  withState('crosshairMode', 'setCrosshairMode', false),
  withState('showGridLines', 'setShowGridLines', false),
  withState('heatMapMode', 'setHeatMapMode', false),
  withState('isLoading', 'setIsLoading', true),
  withState('caseCount', 'setCaseCount', 0),
  withState('lastRequest', 'setLastRequest', null),
  withState(
    'uniqueGridClass',
    'setUniqueGridClass',
    () => GRID_CLASS + uniqueId(),
  ),
  withState('trackLegends', 'setTrackLegends', []),
  withState('variationDataTypes', 'setVariationDataTypes', ['cnv', 'ssm']),
  withState('toggledCnvChanges', 'setToggledCnvChanges', cnvChangeTypes),
  withState('toggledConsequences', 'setToggledConsequences', consequenceTypes),
  withState('rankOncoGridBy', 'setRankOncoGridBy', 'ssm'),
  mapProps(
    ({
      title,
      impacts,
      toggledConsequences,
      variationDataTypes,
      toggledCnvChanges,
      rankOncoGridBy,
      ...props
    }) => {
      const cases = props.oncoGridData
        ? props.oncoGridData.cases.length
        : MAX_CASES;
      const genes = props.oncoGridData
        ? props.oncoGridData.genes.length
        : MAX_GENES;

      const currentImpacts = getFilterValue({
        currentFilters: props.currentFilters.content,
        dotField: 'ssms.consequence.transcript.annotation.vep_impact',
      });

      const currentConsequenceTypes = get(
        getFilterValue({
          currentFilters: props.currentFilters.content,
          dotField: 'ssms.consequence.transcript.consequence_type',
        }),
        'content.value',
        consequenceTypes,
      );

      const currentCnvChanges = get(
        getFilterValue({
          currentFilters: props.currentFilters.content,
          dotField: 'cnv.cnv_change',
        }),
        'content.value',
        cnvChangeTypes,
      );
      // const filteredConsequenceTypes = consequenceTypes.filter((c: any) =>
      //   currentConsequenceTypes.includes(c),
      // );

      const filteredConsequenceTypes = toggledConsequences.filter((c: any) =>
        currentConsequenceTypes.includes(c),
      );

      const filteredCnvChanges = toggledCnvChanges.filter((c: any) =>
        currentCnvChanges.includes(c),
      );

      const currentFilters = props.currentFilters;
      const currentSSMFilters = replaceFilters(
        {
          op: 'and',
          content: [
            {
              op: 'in',
              content: {
                field: 'ssms.consequence.transcript.consequence_type',
                value: filteredConsequenceTypes,
              },
            },
          ],
        },
        props.currentFilters,
      );

      let currentCNVFilters = replaceFilters(
        {
          op: 'and',
          content: [
            {
              op: 'in',
              content: {
                field: 'cnv.cnv_change',
                value: filteredCnvChanges,
              },
            },
          ],
        },
        props.currentFilters,
      );

      return {
        ...props,
        title:
          title ||
          `${cases}${cases < props.caseCount
            ? ' Most'
            : ''} Mutated Cases and Top ${genes} Mutated Genes By SSM`,
        impacts:
          impacts || (currentImpacts && currentImpacts.content.value) || [],
        filteredConsequenceTypes,
        currentFilters,
        toggledConsequences,
        variationDataTypes,
        toggledCnvChanges,
        currentCNVFilters,
        currentSSMFilters,
        rankOncoGridBy,
      };
    },
  ),
  withTooltip,
  withProps({
    oncoGridHeight: 150,
    oncoGridPadding: 306,
    oncoGridWrapper: null,
    async getQueries(
      {
        oncoGrid,
        setOncoGrid,
        setOncoGridData,
        oncoGridPadding,
        oncoGridHeight,
        setIsLoading,
        projectId,
        heatMapMode,
        setHeatMapMode,
        setShowGridLines,
        setCrosshairMode,
        setTrackLegends,
        currentFilters,
        impacts,
        uniqueGridClass,
        dispatch,
        push,
        filteredConsequenceTypes,
        setCaseCount,
        showGridLines,
        lastRequest,
        setLastRequest,
        setTooltip,
        variationDataTypes,
        setVariationDataTypes,
        currentCNVFilters,
        currentSSMFilters,
        toggledCnvChanges,
        rankOncoGridBy,
      }: TProps = {},
      previousResponses: Object,
    ): Promise<*> {
      if (!filteredConsequenceTypes.length) {
        if (oncoGrid.toggleGridLines) oncoGrid.destroy();
        setOncoGrid({});
        setOncoGridData(null);
        setIsLoading(false);
        return;
      }

      if (lastRequest) lastRequest.cancelled = true;
      const request = { cancelled: false };
      setLastRequest(request);
      performanceTracker.begin('oncogrid:fetch');
      const responses = await getQueries({
        currentFilters,
        maxCases: MAX_CASES,
        maxGenes: MAX_GENES,
        currentCNVFilters,
        currentSSMFilters,
        rankOncoGridBy,
        heatMapMode,
      });

      const performanceContext = {
        donors: responses.cases.length,
        genes: responses.genes.length,
        ssm_occurrences: responses.ssm_occurrences.length,
        cnv_occurrences: responses.cnv_occurrences.length,
        maxCases: MAX_CASES,
        maxGenes: MAX_GENES,
      };

      performanceTracker.end('oncogrid:fetch', performanceContext);
      if (!wrapperRefs[uniqueGridClass] || request.cancelled) return;

      performanceTracker.begin('oncogrid:process');
      const gridParams = oncoGridParams({
        grid: showGridLines,
        colorMap,
        element: wrapperRefs[uniqueGridClass],
        donorData: responses.cases,
        geneData: responses.genes,
        ssmOccurrencesData: responses.ssm_occurrences,
        cnvOccurrencesData: responses.cnv_occurrences,
        width:
          (containerRefs[uniqueGridClass] || { offsetWidth: 0 }).offsetWidth -
          oncoGridPadding,
        height: oncoGridHeight,
        trackPadding: 30,
        impacts,
        consequenceTypes: filteredConsequenceTypes,
        heatMap: heatMapMode,
      });

      performanceTracker.end('oncogrid:process', performanceContext);

      if (gridParams) {
        if (previousResponses && oncoGrid.toggleGridLines) oncoGrid.destroy();

        performanceTracker.begin('oncogrid:init');
        const grid = new OncoGrid(gridParams);

        performanceTracker.end('oncogrid:init', performanceContext);
        grid.resize = debounce(grid.resize.bind(grid), 200);

        performanceTracker.begin('oncogrid:render');
        grid.render();

        grid.container.node().style.visibility = 'hidden';
        grid.on('render:all:end', () => {
          setIsLoading(false);
          grid.container.node().style.visibility = 'visible';
          performanceTracker.end('oncogrid:render', performanceContext);
        });

        mouseEvents({
          grid,
          setTooltip,
          trackLegends: gridParams.trackLegends,
          push,
          dispatch,
          currentFilters,
        });

        setCaseCount(responses.totalCases);
        setOncoGrid(grid);
        setOncoGridData(responses);
        refreshGridState({
          oncoGrid: grid,
          setHeatMapMode,
          setShowGridLines,
          setCrosshairMode,
          setIsLoading,
        });
      } else {
        if (oncoGrid.toggleGridLines) oncoGrid.destroy();
        setOncoGridData(null);
        setIsLoading(false);
      }

      if (gridParams) {
        setTrackLegends(Object.values(gridParams.trackLegends));
      }
    },
  }),
  connect(),
  withSize(),
  lifecycle({
    componentWillReceiveProps(nextProps: Object): void {
      const {
        crosshairMode: lastCrosshairMode,
        showGridLines: lastShowGridLines,
        heatMapMode: lastHeadMapMode,
        size: { width: lastWidth },
      } = this.props;

      const {
        oncoGrid,
        oncoGridPadding,
        oncoGridHeight,
        crosshairMode,
        showGridLines,
        heatMapMode,
        size: { width },
        uniqueGridClass,
      } = nextProps;

      if (oncoGrid.toggleGridLines) {
        if (lastCrosshairMode !== crosshairMode) {
          oncoGrid.setCrosshair(crosshairMode);
        }
        if (lastShowGridLines !== showGridLines) {
          oncoGrid.setGridLines(showGridLines);
        }
        if (lastHeadMapMode !== heatMapMode) oncoGrid.setHeatmap(heatMapMode);
        if (width !== lastWidth) {
          oncoGrid.resize(
            wrapperRefs[uniqueGridClass].offsetWidth - oncoGridPadding,
            oncoGridHeight,
          );
        }
      }

      if (
        JSON.stringify(this.props.currentCNVFilters) !==
          JSON.stringify(nextProps.currentCNVFilters) ||
        JSON.stringify(this.props.currentSSMFilters) !==
          JSON.stringify(nextProps.currentSSMFilters) ||
        this.props.heatMapMode !== nextProps.heatMapMode
      ) {
        this.props.setIsLoading(true);
        this.props.getQueries(nextProps, this.props.oncoGridData);
      }
    },
    componentDidMount(): void {
      this.props.getQueries(this.props);
    },
    componentWillUnmount(): void {
      const { uniqueGridClass, oncoGrid } = this.props;
      if (oncoGrid.toggleGridLines) oncoGrid.destroy();
      delete containerRefs[uniqueGridClass];
      delete wrapperRefs[uniqueGridClass];
    },
  }),
)(
  ({
    oncoGrid,
    oncoGridData,
    heatMapMode,
    setHeatMapMode,
    showGridLines,
    setShowGridLines,
    crosshairMode,
    setCrosshairMode,
    isLoading,
    setIsLoading,
    uniqueGridClass,
    trackLegends,
    title,
    toggledCnvChanges,
    setToggledCnvChanges,
    toggledConsequences,
    setToggledConsequences,
    variationDataTypes,
    setVariationDataTypes,
  }) => (
    <Loader loading={isLoading} height="800px">
      <div
        className="test-oncogrid-wrapper"
        style={{
          ...styles.container,
          ...(isFullScreen() && styles.fullscreen),
        }}
        ref={r => {
          containerRefs[uniqueGridClass] = r;
        }}
      >
        <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h4 style={{ textAlign: 'center' }}>{title}</h4>
          {!isLoading && (
            <div>
              <Row
                style={{
                  justifyContent: 'flex-start',
                  marginRight: '12px',
                  flexWrap: 'wrap',
                  paddingBottom: 15,
                }}
                spacing="1rem"
              >
                <DownloadVisualizationButton
                  svg={() => {
                    const elementsAfter = trackLegends.map(html => {
                      const div = document.createElement('div');
                      div.innerHTML = html;
                      div.style.position = 'absolute';
                      div.style.left = '-99999px';
                      document.body.appendChild(div);
                      return div;
                    });

                    const wrappedSvg = wrapSvg({
                      selector: `.${uniqueGridClass} svg`,
                      title,
                      className: GRID_CLASS,
                      embed: {
                        top: {
                          elements: [
                            containerRefs[uniqueGridClass].querySelector(
                              '.oncogrid-legend',
                            ),
                          ],
                        },
                        bottom: {
                          elements: elementsAfter,
                          styles:
                            'display: inline-block; width: 200px; vertical-align: top; ',
                        },
                      },
                    });

                    elementsAfter.forEach(el => document.body.removeChild(el));
                    return wrappedSvg;
                  }}
                  data={oncoGridData}
                  stylePrefix={`.${GRID_CLASS}`}
                  slug="oncogrid"
                  noText
                  tooltipHTML="Download"
                  disabled={!oncoGridData}
                />
                <Tooltip Component="Reload Grid">
                  <Button
                    style={styles.button}
                    onClick={() => {
                      oncoGrid.reload();
                      refreshGridState({
                        oncoGrid,
                        setHeatMapMode,
                        setShowGridLines,
                        setCrosshairMode,
                        setIsLoading,
                      });
                    }}
                    disabled={!oncoGridData}
                  >
                    <i className="fa fa-undo" />
                    <Hidden>Reload</Hidden>
                  </Button>
                </Tooltip>
                <Tooltip Component="Cluster Data">
                  <Button
                    style={styles.button}
                    onClick={() => oncoGrid.cluster()}
                    disabled={!oncoGridData}
                  >
                    <i className="fa fa-sort-amount-desc" />
                    <Hidden>Cluster</Hidden>
                  </Button>
                </Tooltip>
                <Tooltip Component="Toggle Heatmap View">
                  <Button
                    style={{
                      ...styles.button,
                      ...(heatMapMode && styles.buttonActive),
                    }}
                    disabled={toggledConsequences.length === 0 || !oncoGridData}
                    onClick={() => setHeatMapMode(!heatMapMode)}
                  >
                    <i className="fa fa-fire" />
                    <Hidden>Heatmap</Hidden>
                  </Button>
                </Tooltip>
                <Tooltip Component="Toggle Gridlines">
                  <Button
                    style={{
                      ...styles.button,
                      ...(showGridLines && styles.buttonActive),
                    }}
                    onClick={() => setShowGridLines(!showGridLines)}
                    disabled={!oncoGridData}
                  >
                    <i className="fa fa-th" />
                    <Hidden>Lines</Hidden>
                  </Button>
                </Tooltip>
                <Tooltip Component="Toggle Crosshairs">
                  <Button
                    style={{
                      ...styles.button,
                      ...(crosshairMode && styles.buttonActive),
                    }}
                    onClick={() => setCrosshairMode(!crosshairMode)}
                    disabled={!oncoGridData}
                  >
                    <i className="fa fa-crosshairs" />
                    <Hidden>Crosshair</Hidden>
                  </Button>
                </Tooltip>
                <Tooltip Component="Fullscreen">
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
                        refreshGridState({
                          oncoGrid,
                          setHeatMapMode,
                          setShowGridLines,
                          setCrosshairMode,
                          setIsLoading,
                        });
                      } else {
                        enterFullScreen(containerRefs[uniqueGridClass]);
                        oncoGrid.resize(
                          screen.width - 400,
                          screen.height - 400,
                          true,
                        );
                      }
                    }}
                    disabled={!oncoGridData}
                  >
                    <FullScreenIcon />
                    <Hidden>Fullscreen</Hidden>
                  </Button>
                </Tooltip>
              </Row>
              {crosshairMode && (
                <div
                  style={{
                    fontSize: '1.1rem',
                    verticalAlign: 'top',
                    width: '100%',
                    textAlign: 'right',
                    position: 'absolute',
                    top: '40px',
                    right: '10px',
                  }}
                >
                  Click and drag to select a region on the OncoGrid to zoom in.
                </div>
              )}
            </div>
          )}
        </Row>
        <Row
          style={{
            width: '80%',
            alignItems: 'center',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              flexGrow: 1,
            }}
            className="oncogrid-mutation-legend"
          >
            <h5>Mutations</h5>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <ToggleSwatchLegend
                toggledValues={toggledConsequences}
                toggle={key => {
                  if (toggledConsequences.includes(key)) {
                    setToggledConsequences(
                      toggledConsequences.filter(c => c !== key),
                    );
                  } else {
                    setToggledConsequences([...toggledConsequences, key]);
                  }
                }}
                toggleAll={() => {
                  if (toggledConsequences.length > 0) {
                    setToggledConsequences([]);
                  } else {
                    setToggledConsequences(consequenceTypes);
                  }
                }}
                colorMap={colorMap.mutation}
                type={'mutations'}
                heatMapMode={heatMapMode}
              />
            </div>
          </div>

          {!heatMapMode && (
            <div style={{ flexGrow: 1 }} className="oncogrid-cnv-legend">
              <h5>CNV Changes</h5>
              <ToggleSwatchLegend
                toggledValues={toggledCnvChanges}
                toggle={key => {
                  if (toggledCnvChanges.includes(key)) {
                    setToggledCnvChanges(
                      toggledCnvChanges.filter(c => c !== key),
                    );
                  } else {
                    setToggledCnvChanges([...toggledCnvChanges, key]);
                  }
                }}
                toggleAll={() => {
                  if (toggledCnvChanges.length > 0) {
                    setToggledCnvChanges([]);
                  } else {
                    setToggledCnvChanges(cnvChangeTypes);
                  }
                }}
                colorMap={colorMap.cnv}
                type={'copy number variations'}
              />
            </div>
          )}
        </Row>
        {!oncoGridData &&
          !isLoading && (
            <Column style={{ padding: '2rem 0' }}>
              <div>No result found.</div>
            </Column>
          )}

        <div
          className={`${GRID_CLASS} ${uniqueGridClass}`}
          ref={n => {
            wrapperRefs[uniqueGridClass] = n;
          }}
          style={{
            cursor: crosshairMode ? 'crosshair' : 'pointer',
            visibility: isLoading ? 'hidden' : 'visible',
            paddingTop: 15,
          }}
        />
      </div>
    </Loader>
  ),
);

export default OncoGridWrapper;
