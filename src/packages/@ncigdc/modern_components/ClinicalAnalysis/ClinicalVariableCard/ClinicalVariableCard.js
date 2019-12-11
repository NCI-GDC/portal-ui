import React, { Fragment } from 'react';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';
import {
  find,
  isEmpty,
  maxBy,
  reject,
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
  BarChartIcon,
  BoxPlot,
  CloseIcon,
  SpinnerIcon,
  SurvivalIcon,
} from '@ncigdc/theme/icons';
import termCapitaliser from '@ncigdc/utils/customisation';
import {
  humanify,
} from '@ncigdc/utils/string';
import {
  removeClinicalAnalysisVariable,
  updateClinicalAnalysisVariable,
} from '@ncigdc/dux/analysis';
import Loader from '@ncigdc/uikit/Loaders/Loader';
import {
  MAX_SURVIVAL_CURVES,
  MIN_SURVIVAL_CASES,
  SURVIVAL_PLOT_COLORS,
} from '@ncigdc/utils/survivalplot';

import ActionsDropdown from './components/ActionsDropdown';
import ClinicalBoxPlot from './components/ClinicalBoxPlot';
import ClinicalHistogram from './components/ClinicalHistogram';
import ClinicalSurvivalPlot from './components/ClinicalSurvivalPlot';

import {
  FIELDS_WITHOUT_BOX_OR_QQ,
  makeBoxTableData,
  makeContinuousActionsFilters,
} from './utils/continuous';

import makeCategoricalActionsFilters from './utils/categorical';

import {
  makeHeadings,
  styles,
} from './utils/shared';

const vizButtons = {
  box: {
    action: updateClinicalAnalysisVariable,
    icon: <BoxPlot style={styles.chartIcon} />,
    title: 'Box/QQ Plot',
  },
  delete: {
    action: removeClinicalAnalysisVariable,
    icon: <CloseIcon style={styles.chartIcon} />,
    title: 'Remove Card',
  },
  histogram: {
    action: updateClinicalAnalysisVariable,
    icon: <BarChartIcon style={styles.chartIcon} />,
    title: 'Histogram',
  },
  survival: {
    action: updateClinicalAnalysisVariable,
    icon: <SurvivalIcon style={styles.chartIcon} />,
    title: 'Survival Plot',
  },
};

const makeTableData = ({
  active_chart,
  displayData = [],
  fieldName,
  selectedBins,
  selectedSurvivalPlots,
  selectedSurvivalLoadingIds,
  setSelectedBins,
  theme,
  updateSelectedSurvivalPlots,
}) => displayData.map(dDBin => {
  const { displayName, doc_count, key } = dDBin;
  const isSelected = find(selectedBins, { key: displayName });
  const selectedBin = selectedSurvivalPlots.find(s => s.keyName === displayName);
  const isSurvivalLoading = selectedSurvivalLoadingIds.includes(displayName);
  const isSelectedForSurvival = selectedBin !== undefined;
  const isSurvivalFull = selectedSurvivalPlots.length === MAX_SURVIVAL_CURVES;

  // console.log('displayData', displayData);

  return {
    ...dDBin,
    select: (
      <input
        aria-label={`${fieldName} ${displayName}`}
        checked={isSelected}
        disabled={doc_count === 0}
        id={`${fieldName}-${key}`}
        onChange={() => {
          if (isSelected) {
            setSelectedBins(
              reject(selectedBins, r => r.key === key),
            );
          } else {
            setSelectedBins(selectedBins.concat(dDBin));
          }
        }}
        style={{
          marginLeft: 3,
          pointerEvents: 'initial',
        }}
        type="checkbox"
        value={key}
        />
    ),
    ...active_chart === 'survival' && {
      survival: (
        <Tooltip
          Component={
            key === '_missing' || doc_count < MIN_SURVIVAL_CASES
              ? 'Not enough data'
              : isSelectedForSurvival
                ? `Click icon to remove "${displayName}"`
                : isSurvivalFull
                  ? `Maximum plots (${MAX_SURVIVAL_CURVES}) reached`
                  : `Click icon to plot "${displayName}"`
          }
          >
          <Button
            disabled={
              key === '_missing' ||
              doc_count < MIN_SURVIVAL_CASES ||
              (isSurvivalFull && !isSelectedForSurvival)
            }
            onClick={() => {
              updateSelectedSurvivalPlots(displayData, dDBin);
            }}
            style={{
              backgroundColor: isSelectedForSurvival ? selectedBin.color : theme.greyScale3,
              color: 'white',
              margin: '0 auto',
              opacity:
                key === '_missing' ||
                  doc_count < MIN_SURVIVAL_CASES ||
                  (isSurvivalFull && !isSelectedForSurvival)
                    ? '0.33'
                    : '1',
              padding: '2px 3px',
              position: 'static',
            }}
            >
            {isSurvivalLoading ? <SpinnerIcon /> : <SurvivalIcon />}
            <Hidden>add to survival plot</Hidden>
          </Button>
        </Tooltip>
      ),
    },
  };
});

const ClinicalVariableCard = ({
  boxPlotValues,
  currentAnalysis,
  dataBuckets,
  dataDimension,
  dispatch,
  displayData,
  fieldName,
  filters,
  id,
  isLoading,
  key,
  openCustomBinModal,
  overallSurvivalData,
  plots,
  qqData,
  resetBins,
  binsAreCustom,
  selectedBins,
  selectedSurvivalPlots = [],
  selectedSurvivalData,
  selectedSurvivalLoadingIds,
  setId,
  setQQData,
  setQQDataIsSet,
  setSelectedBins,
  style = {},
  survivalDataLoading,
  theme,
  totalDocs,
  updateSelectedSurvivalPlots,
  variable,
  wrapperId,
}) => {
  const tableData = variable.active_chart === 'box'
    ? makeBoxTableData(boxPlotValues)
    : makeTableData({
      active_chart: variable.active_chart,
      displayData,
      fieldName,
      selectedBins,
      selectedSurvivalLoadingIds,
      selectedSurvivalPlots,
      setSelectedBins,
      theme,
      updateSelectedSurvivalPlots,
    });

  const histogramData =
    variable.active_chart === 'histogram'
      ? tableData.map(({ displayName, doc_count }) => ({
        fullLabel: displayName,
        label: displayName,
        tooltip: `${displayName}: ${
          doc_count.toLocaleString()} (${
          (((doc_count || 0) / totalDocs) * 100).toFixed(2)}%)`,
        value: variable.active_calculation === 'number'
          ? doc_count
          : (doc_count / totalDocs) * 100,
      }))
      : [];

  const maxKeyNameLength = (
    maxBy(histogramData
      .map(d => d.fullLabel), (item) => item.length) || ''
  ).length;

  const tsvSubstring = fieldName.replace(/\./g, '-');

  const actionsFiltersArgs = {
    fieldName,
    filters,
    selectedBins,
  };
  const actionsFilters = selectedBins.length === 0
    ? {}
    : variable.plotTypes === 'continuous'
      ? makeContinuousActionsFilters(actionsFiltersArgs)
      : makeCategoricalActionsFilters(actionsFiltersArgs);

  const disabledCharts = plotType => isEmpty(tableData) &&
    plotType !== 'delete';

  const downloadChartName = fieldName.split('.')[1];

  return (
    <Column
      className="clinical-analysis-card"
      key={key}
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
          className="print-w500"
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
            .reduce((buttons, plotType) => (
              FIELDS_WITHOUT_BOX_OR_QQ.includes(fieldName) && plotType === 'box'
                ? buttons // avoid boxplot+qq for those fields
                : buttons.concat(
                  <Tooltip Component={vizButtons[plotType].title} key={plotType}>
                    <Button
                      className={`chart-button-${plotType}`}
                      disabled={disabledCharts(plotType)}
                      onClick={() => {
                        dispatch(
                          vizButtons[plotType].action({
                            fieldName,
                            id,
                            variable: {
                              active_chart: plotType,
                            },
                          }),
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
                  </Tooltip>,
                )), [])}
        </Row>
      </Row>
      {isLoading
        ? <Loader />
        : isEmpty(tableData)
          ? (
            <Row
              id={`${wrapperId}-container`}
              style={{
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
              }}
              >
              <div className="print-mb print-mt print-w500">No data for this field</div>
            </Row>
          )
          : (
            <Fragment>
              <Column id={`${wrapperId}-container`}>
                {['histogram'].includes(variable.active_chart) && (
                  <Row className="no-print" style={{ paddingLeft: 10 }}>
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
                          onChange={() => dispatch(updateClinicalAnalysisVariable({
                            fieldName,
                            id,
                            variable: {
                              active_calculation: 'percentage',
                            },
                          }))}
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
                          onChange={() => dispatch(updateClinicalAnalysisVariable({
                            fieldName,
                            id,
                            variable: {
                              active_calculation: 'number',
                            },
                          }))}
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
                        slug={`${downloadChartName}-bar-chart`}
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

                {variable.active_chart === 'histogram' && (
                  <ClinicalHistogram
                    active_calculation={variable.active_calculation}
                    downloadChartName={downloadChartName}
                    histogramData={histogramData}
                    histogramStyles={styles.histogram}
                    theme={theme}
                    type={variable.type}
                    />
                )}

                {variable.active_chart === 'survival' && (
                (variable.isSurvivalCustom &&
                  selectedSurvivalPlots.length === 0 &&
                  !variable.showOverallSurvival)
                  ? (
                    <Row
                      id={`${wrapperId}-container`}
                      style={{
                        alignItems: 'center',
                        flex: 1,
                        justifyContent: 'center',
                      }}
                      >
                      No matching categories
                    </Row>
                  )
                  : (
                    <ClinicalSurvivalPlot
                      downloadChartName={downloadChartName}
                      palette={selectedSurvivalPlots.length > 0
                        ? selectedSurvivalPlots.map(ssBin => ssBin.color)
                      : SURVIVAL_PLOT_COLORS}
                      plotType={selectedSurvivalPlots.length === 0 ||
                        variable.showOverallSurvival
                        ? 'clinicalOverall'
                        : 'categorical'}
                      survivalData={selectedSurvivalPlots.length === 0 ||
                        variable.showOverallSurvival
                        ? overallSurvivalData
                        : selectedSurvivalData}
                      survivalDataLoading={survivalDataLoading}
                      />
                    )
                )}

                {variable.active_chart === 'box' && (
                  <ClinicalBoxPlot
                    boxPlotValues={boxPlotValues}
                    dataBuckets={dataBuckets}
                    downloadChartName={downloadChartName}
                    fieldName={fieldName}
                    filters={filters}
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
                    currentAnalysis={currentAnalysis}
                    dispatch={dispatch}
                    filters={actionsFilters}
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
                      <DropdownItem
                        onClick={openCustomBinModal}
                        style={styles.actionMenuItem}
                        >
                      Edit Bins
                      </DropdownItem>
                      <DropdownItem
                        onClick={resetBins}
                        style={{
                          ...styles.actionMenuItem,
                          ...binsAreCustom || variable.isSurvivalCustom
                            ? {}
                            : styles.actionMenuItemDisabled(theme),
                        }}
                        >
                      Reset to Default
                      </DropdownItem>
                    </Dropdown>
                  )}
                </Row>

                <EntityPageHorizontalTable
                  data={tableData.map(tableRow => ({
                    ...tableRow,
                    key: tableRow.displayName,
                  }))}
                  headings={makeHeadings(
                    variable.active_chart,
                    dataDimension,
                    fieldName + (binsAreCustom
                      ? ' (User defined bins applied)'
                      : ''),
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

export default ClinicalVariableCard;
