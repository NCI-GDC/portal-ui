import React, { Fragment } from 'react';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';

import {
  find,
  get,
  isEmpty,
  maxBy,
  reject,
  sortBy,
} from 'lodash';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { visualizingButton, zDepth1 } from '@ncigdc/theme/mixins';

import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Hidden from '@ncigdc/components/Hidden';

import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import wrapSvg from '@ncigdc/utils/wrapSvg';

import {
  MAXIMUM_CURVES,
  MINIMUM_CASES,
} from '@ncigdc/utils/survivalplot';
import { SpinnerIcon, SurvivalIcon } from '@ncigdc/theme/icons';

import termCapitaliser from '@ncigdc/utils/customisation';

import {
  humanify,
  parseContinuousValue,
} from '@ncigdc/utils/string';

import ActionsDropdown from './ActionsDropdown';
import ClinicalHistogram from './ClinicalHistogram';
import ClinicalSurvivalPlot from './ClinicalSurvivalPlot';

import ClinicalBoxPlot from './ClinicalBoxPlot';

import {
  boxTableAllowedStats,
  boxTableRenamedStats,
  colors,
  getCardFilters,
  getHeadings,
  styles,
  vizButtons,
} from './helpers';

const getTableData = (
  binData,
  getContinuousBins,
  fieldName,
  totalDocs,
  selectedSurvivalBins,
  setId,
  selectedBins,
  setSelectedBins,
  variable,
  updateSelectedSurvivalBins,
  selectedSurvivalLoadingIds,
) => {
  if (isEmpty(binData)) {
    return [];
  }

  // DIFFERENT - DISPLAY DATA IS DIFFERENT,
  // THE OTHER STUFF IS THE SAME

  const displayData = binData
    .sort((a, b) => a.keyArray[0] - b.keyArray[0])
    .reduce(getContinuousBins, []);

  return displayData.map(bin => Object.assign(
    {},
    bin,
    {
      // SAME
      select: (
        <input
          aria-label={`${fieldName} ${bin.key}`}
          checked={!!find(selectedBins, { key: bin.key })}
          disabled={bin.doc_count === 0}
          id={`${fieldName}-${bin.key}`}
          onChange={() => {
            if (find(selectedBins, { key: bin.key })) {
              setSelectedBins(
                reject(selectedBins, r => r.key === bin.key)
              );
            } else {
              setSelectedBins(selectedBins.concat(bin));
            }
          }}
          style={{
            marginLeft: 3,
            pointerEvents: 'initial',
          }}
          type="checkbox"
          value={bin.key}
          />
      ),
    },
    variable.active_chart === 'survival' && {
      // SAME
      survival: (
        <Tooltip
          Component={
            bin.key === '_missing' || bin.chart_doc_count < MINIMUM_CASES
              ? 'Not enough data'
              : selectedSurvivalBins.indexOf(bin.key) > -1
                ? `Click icon to remove "${bin.groupName || bin.key}"`
                : selectedSurvivalBins.length < MAXIMUM_CURVES
                  ? `Click icon to plot "${bin.groupName || bin.key}"`
                  : `Maximum plots (${MAXIMUM_CURVES}) reached`
          }
          >
          <Button
            disabled={
              bin.key === '_missing' ||
              bin.chart_doc_count < MINIMUM_CASES ||
              (selectedSurvivalBins.length >= MAXIMUM_CURVES &&
                selectedSurvivalBins.indexOf(bin.key) === -1)
            }
            onClick={() => {
              updateSelectedSurvivalBins(displayData, bin);
            }}
            style={{
              backgroundColor:
                selectedSurvivalBins.indexOf(bin.key) === -1
                  ? '#666'
                  : colors(selectedSurvivalBins.indexOf(bin.key)),
              color: 'white',
              margin: '0 auto',
              opacity:
                bin.key === '_missing' ||
                  bin.chart_doc_count < MINIMUM_CASES ||
                  (selectedSurvivalBins.length >= MAXIMUM_CURVES &&
                    selectedSurvivalBins.indexOf(bin.key) === -1)
                  ? '0.33'
                  : '1',
              padding: '2px 3px',
              position: 'static',
            }}
            >
            {selectedSurvivalLoadingIds.indexOf(bin.key) !== -1
              ? <SpinnerIcon />
              : <SurvivalIcon />}
            <Hidden>add to survival plot</Hidden>
          </Button>
        </Tooltip>
      ),
    },
  ));
};

const getBoxTableData = (data = {}) => (
  // DIFFERENT - CONTINUOUS ONLY
  Object.keys(data).length
    ? sortBy(Object.keys(data), datum => boxTableAllowedStats
      .indexOf(datum.toLowerCase()))
      .reduce(
        (tableData, stat) => (
          boxTableAllowedStats.includes(stat.toLowerCase())
            ? tableData.concat({
              count: parseContinuousValue(data[stat]),
              stat: boxTableRenamedStats[stat] || stat, // Shows the descriptive label
            })
            : tableData
        ), []
      )
    : []
);

const ContinuousView = ({
  binData,
  boxPlotValues,
  currentAnalysis,
  dataBuckets,
  dataDimension,
  dispatch,
  dispatchUpdateClinicalVariable,
  fieldName,
  filters,
  getContinuousBins,
  id,
  openCustomBinModal,
  overallSurvivalData,
  plots,
  qqData,
  resetBins,
  resetBinsDisabled,
  selectedBins,
  selectedSurvivalBins,
  selectedSurvivalData,
  selectedSurvivalLoadingIds,
  setId,
  setQQData,
  setQQDataIsSet,
  setSelectedBins,
  style = {},
  survivalPlotLoading,
  theme,
  totalDocs,
  updateSelectedSurvivalBins,
  variable,
  wrapperId,
}) => {
  // MOVE TO RECOMPOSE ???
  // DIFFERENT - BOX IS CONTINUOUS ONLY
  // SAME - EVERYTHING ELSE UNTIL RENDER/RETURN
  const tableData = variable.active_chart === 'box'
    ? getBoxTableData(boxPlotValues)
    : getTableData(
      binData,
      getContinuousBins,
      fieldName,
      totalDocs,
      selectedSurvivalBins,
      setId,
      selectedBins,
      setSelectedBins,
      variable,
      updateSelectedSurvivalBins,
      selectedSurvivalLoadingIds,
    );

  const histogramData =
    variable.active_chart === 'histogram'
      ? tableData.map(d => ({
        fullLabel: d.groupName || d.key,
        label: d.groupName || d.key,
        tooltip: `${d.key}: ${
          d.chart_doc_count.toLocaleString()} (${
          (((d.chart_doc_count || 0) / totalDocs) * 100).toFixed(2)}%)`,
        value: variable.active_calculation === 'number'
          ? d.chart_doc_count
          : (d.chart_doc_count / totalDocs) * 100,
      }))
      : [];

  const maxKeyNameLength = (
    maxBy(histogramData
      .map(d => d.fullLabel), (item) => item.length) || ''
  ).length;

  const tsvSubstring = fieldName.replace(/\./g, '-');
  const cardFilters = getCardFilters(
    variable.plotTypes, selectedBins, fieldName, filters
  );
  const disabledCharts = plotType => isEmpty(tableData) &&
    plotType !== 'delete';

  return (
    <Column
      className="clinical-analysis-categorical-card"
      style={{
        ...zDepth1,
        height: 560,
        justifyContent: 'space-between',
        margin: '0 1rem 1rem',
        padding: '0.5rem 1rem 1rem',
        ...style,
      }}
      >
      <Row
        id={wrapperId}
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '5px 0 10px',
        }}
        >
        <h2
          style={{
            fontSize: '1.8rem',
            marginBottom: 0,
            marginTop: 10,
          }}
          >
          {humanify({ term: termCapitaliser(fieldName).split('__').pop() })}
        </h2>
        <Row>
          {plots.concat('delete')
          // SAME
            .map(plotType => (
              <Tooltip Component={vizButtons[plotType].title} key={plotType}>
                <Button
                  className={`chart-button-${plotType}`}
                  disabled={disabledCharts(plotType)}
                  onClick={() => {
                    dispatch(
                      vizButtons[plotType].action({
                        fieldName,
                        id,
                        value: plotType,
                        variableKey: 'active_chart',
                      })
                    );
                  }}
                  style={{
                    ...(disabledCharts(plotType)
                      ? {}
                      : plotType === variable.active_chart
                        ? styles.activeButton(theme)
                        : styles.common(theme)),
                    margin: 2,
                  }}
                  >
                  <Hidden>{vizButtons[plotType].title}</Hidden>
                  {vizButtons[plotType].icon}
                </Button>
              </Tooltip>
            ))}
        </Row>
      </Row>
      {isEmpty(tableData)
      // SAME
        ? (
          <Row
            id={`${wrapperId}-container`}
            style={{
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
            }}
            >
            There is no data for this facet
          </Row>
        )
        : (
          <Fragment>
            <Column id={`${wrapperId}-container`}>
              {['histogram'].includes(variable.active_chart) && (
                <Row style={{ paddingLeft: 10 }}>
                  <form style={{ width: '100%' }}>
                    <label
                      htmlFor={`variable-percentage-radio-${fieldName}`}
                      style={{
                        fontSize: '1.2rem',
                        marginRight: 10,
                      }}
                      >
                      <input
                        aria-label="Percentage of cases"
                        checked={variable.active_calculation === 'percentage'}
                        id={`variable-percentage-radio-${fieldName}`}
                        onChange={() => dispatchUpdateClinicalVariable({
                          value: 'percentage',
                          variableKey: 'active_calculation',
                        })}
                        style={{ marginRight: 5 }}
                        type="radio"
                        value="percentage"
                        />
                      % of Cases
                    </label>
                    <label
                      htmlFor={`variable-number-radio-${fieldName}`}
                      style={{ fontSize: '1.2rem' }}
                      >
                      <input
                        aria-label="Number of cases"
                        checked={variable.active_calculation === 'number'}
                        id={`variable-number-radio-${fieldName}`}
                        onChange={() => dispatchUpdateClinicalVariable({
                          value: 'number',
                          variableKey: 'active_calculation',
                        })}
                        style={{ marginRight: 5 }}
                        type="radio"
                        value="number"
                        />
                      # of Cases
                    </label>
                    <DownloadVisualizationButton
                      data={histogramData.map(d => ({
                        label: d.fullLabel,
                        value: d.value,
                      }))}
                      key="download"
                      noText
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      slug={`${fieldName}-bar-chart`}
                      style={{
                        float: 'right',
                        marginRight: 2,
                      }}
                      svg={() => wrapSvg({
                        bottomBuffer: maxKeyNameLength * 3,
                        rightBuffer: maxKeyNameLength * 2,
                        selector: `#${wrapperId}-container .test-bar-chart svg`,
                        title: humanify({ term: fieldName }),
                      })}
                      tooltipHTML="Download image or data"
                      />
                  </form>
                </Row>
              )}

              {/* SAME */}
              {variable.active_chart === 'histogram' && (
                <ClinicalHistogram
                  active_calculation={variable.active_calculation}
                  histogramData={histogramData}
                  histogramStyles={styles.histogram}
                  theme={theme}
                  type={variable.type}
                  />
              )}

              {/* SAME */}
              {variable.active_chart === 'survival' && (
                <ClinicalSurvivalPlot
                  plotType={selectedSurvivalBins.length === 0
                    ? 'clinicalOverall'
                    : 'categorical'}
                  survivalData={selectedSurvivalBins.length === 0
                    ? overallSurvivalData
                    : selectedSurvivalData}
                  survivalPlotLoading={survivalPlotLoading}
                  />
              )}

              {/* DIFFERENT - CONTINUOUS ONLY */}
              {variable.active_chart === 'box' && (
                <ClinicalBoxPlot
                  boxPlotValues={boxPlotValues}
                  cardFilters={cardFilters}
                  dataBuckets={dataBuckets}
                  fieldName={fieldName}
                  qqData={qqData}
                  setId={setId}
                  setQQData={setQQData}
                  setQQDataIsSet={setQQDataIsSet}
                  theme={theme}
                  totalDocs={totalDocs}
                  type={variable.type}
                  wrapperId={wrapperId}
                  />
              )}
            </Column>

            <Column>
              <Row
                style={{
                  justifyContent: 'space-between',
                  margin: '5px 0',
                }}
                >
                <ActionsDropdown
                  active_chart={variable.active_chart}
                  cardFilters={cardFilters}
                  currentAnalysis={currentAnalysis}
                  dispatch={dispatch}
                  selectedBins={selectedBins}
                  styles={styles}
                  theme={theme}
                  totalDocs={totalDocs}
                  tsvSubstring={tsvSubstring}
                  />

                {variable.active_chart === 'box' || (
                  <Dropdown
                    button={(
                      <Button
                        rightIcon={<DownCaretIcon />}
                        style={{
                          ...visualizingButton,
                          padding: '0 12px',
                        }}
                        >
                        Customize Bins
                      </Button>
                    )}
                    dropdownStyle={{ right: 0 }}
                    >
                    {/* SAME - ELEMENT
                      DIFFERENT - ONCLICK */}
                    <DropdownItem
                      onClick={openCustomBinModal}
                      style={styles.actionMenuItem}
                      >
                      Edit Bins
                    </DropdownItem>

                    {/* SAME - ELEMENT
                      DIFFERENT - ONCLICK */}

                    <DropdownItem
                      onClick={resetBins}
                      style={{
                        ...styles.actionMenuItem,
                        ...(resetBinsDisabled
                          ? styles.actionMenuItemDisabled(theme)
                          : {}),
                      }}
                      >
                      Reset to Default
                    </DropdownItem>
                  </Dropdown>
                )}
              </Row>

              {/* SAME */}
              <EntityPageHorizontalTable
                data={tableData.map(tableRow => Object.assign(
                  {},
                  tableRow,
                  // the key in the table needs to be the display name
                  {
                    key: tableRow.groupName === undefined
                    ? tableRow.key
                    : tableRow.groupName,
                  }
                ))}
                headings={getHeadings(
                  variable.active_chart,
                  dataDimension,
                  fieldName,
                )}
                tableContainerStyle={{ height: 175 }}
                tableId={`analysis-${tsvSubstring}-table`}
                />
            </Column>
          </Fragment>
      )}
    </Column>
  );
};

export default ContinuousView;
