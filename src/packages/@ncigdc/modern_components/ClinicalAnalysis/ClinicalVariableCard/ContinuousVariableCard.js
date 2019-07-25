import React, { Fragment } from 'react';
import {
  compose,
  lifecycle,
  setDisplayName,
  withProps,
  withPropsOnChange,
  withState,
} from 'recompose';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';
import { connect } from 'react-redux';
import {
  find,
  get,
  groupBy,
  isEmpty,
  isEqual,
  map,
  maxBy,
  reject,
  sortBy,
} from 'lodash';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { Tooltip, TooltipInjector } from '@ncigdc/uikit/Tooltip';
import { visualizingButton, zDepth1 } from '@ncigdc/theme/mixins';

import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Hidden from '@ncigdc/components/Hidden';
import { CreateExploreCaseSetButton, AppendExploreCaseSetButton, RemoveFromExploreCaseSetButton } from '@ncigdc/modern_components/withSetAction';

import { setModal } from '@ncigdc/dux/modal';
import SaveSetModal from '@ncigdc/components/Modals/SaveSetModal';
import AppendSetModal from '@ncigdc/components/Modals/AppendSetModal';
import RemoveSetModal from '@ncigdc/components/Modals/RemoveSetModal';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import wrapSvg from '@ncigdc/utils/wrapSvg';
import {
  DAYS_IN_YEAR,
} from '@ncigdc/utils/ageDisplay';
import { downloadToTSV } from '@ncigdc/components/DownloadTableToTsvButton';
import QQPlotQuery from '@ncigdc/modern_components/QQPlot/QQPlotQuery';
import BoxPlotWrapper from '@oncojs/boxplot';

import {
  getSurvivalCurvesArray,
  MAXIMUM_CURVES,
  MINIMUM_CASES,
} from '@ncigdc/utils/survivalplot';
import '../survivalPlot.css';
import { SpinnerIcon, SurvivalIcon } from '@ncigdc/theme/icons';
import { withTheme } from '@ncigdc/theme';

import { updateClinicalAnalysisVariable } from '@ncigdc/dux/analysis';
import {
  humanify,
  createFacetFieldString,
  parseContinuousValue,
  parseContinuousKey,
  createContinuousGroupName,
} from '@ncigdc/utils/string';
import termCapitaliser from '@ncigdc/utils/customisation';
import timestamp from '@ncigdc/utils/timestamp';

import { analysisColors } from '@ncigdc/utils/constants';
import ContinuousCustomBinsModal from '@ncigdc/components/Modals/ContinuousBinning/ContinuousCustomBinsModal';
import ClinicalHistogram from './ClinicalHistogram';
import ClinicalSurvivalPlot from './ClinicalSurvivalPlot';

import {
  BOX_PLOT_RATIO,
  boxTableAllowedStats,
  boxTableRenamedStats,
  CHART_HEIGHT,
  colors,
  dataDimensions,
  getCardFilters,
  getCountLink,
  getHeadings,
  QQ_PLOT_RATIO,
  styles,
  vizButtons,
} from './helpers';

import '../boxplot.css';
import '../qq.css';
import ClinicalBoxPlot from './ClinicalBoxPlot';

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
              setSelectedBins(selectedBins.int(bin));
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
    ? sortBy(Object.keys(data), datum => boxTableAllowedStats.indexOf(datum.toLowerCase()))
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

const ContinuousVariableCard = ({
  binData,
  currentAnalysis,
  dataBuckets,
  dataDimension,
  boxPlotValues,
  defaultContinuousData,
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
  resetCustomBinsDisabled,
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
    maxBy(histogramData.map(d => d.fullLabel), (item) => item.length) || ''
  ).length;

  // set action will default to cohort total when no bins are selected
  const totalFromSelectedBins = selectedBins && selectedBins.length
    ? selectedBins.reduce((acc, bin) => acc + bin.chart_doc_count, 0)
    : totalDocs;

  const tsvSubstring = fieldName.replace(/\./g, '-');
  const cardFilters = getCardFilters(variable.plotTypes, selectedBins, fieldName, filters);
  const setActionsDisabled = get(selectedBins, 'length', 0) === 0;
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
                  type={type}
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
                <Dropdown
                  button={(
                    <Button
                      rightIcon={<DownCaretIcon />}
                      style={{
                        ...visualizingButton,
                        padding: '0 12px',
                      }}
                      >
                  Select Action
                    </Button>
                  )}
                  dropdownStyle={{
                    left: 0,
                    minWidth: 205,
                  }}
                  >
                  {/* SAME - EXCEPT BOX IS CONTINUOUS ONLY */}
                  {variable.active_chart === 'box' || [
                    <DropdownItem
                      key="save-set"
                      style={{
                        ...styles.actionMenuItem,
                        ...setActionsDisabled ? styles.actionMenuItemDisabled(theme) : {},
                      }}
                      >
                      <Row
                        onClick={() => setActionsDisabled || dispatch(setModal(
                          <SaveSetModal
                            CreateSetButton={CreateExploreCaseSetButton}
                            displayType="case"
                            filters={cardFilters}
                            score="gene.gene_id"
                            setName="Custom Case Selection"
                            sort={null}
                            title={`Save ${totalFromSelectedBins} Cases as New Set`}
                            total={totalFromSelectedBins}
                            type="case"
                            />
                        ))}
                        >
                        Save as new case set
                      </Row>
                    </DropdownItem>,
                    <DropdownItem
                      key="append-set"
                      style={{
                        ...styles.actionMenuItem,
                        ...setActionsDisabled ? styles.actionMenuItemDisabled(theme) : {},
                      }}
                      >
                      <Row
                        onClick={() => setActionsDisabled || dispatch(setModal(
                          <AppendSetModal
                            AppendSetButton={AppendExploreCaseSetButton}
                            displayType="case"
                            field="cases.case_id"
                            filters={cardFilters}
                            scope="explore"
                            score="gene.gene_id"
                            sort={null}
                            title={`Add ${totalFromSelectedBins} Cases to Existing Set`}
                            total={totalFromSelectedBins}
                            type="case"
                            />
                        ))}
                        >
                        Add to existing case set
                      </Row>
                    </DropdownItem>,
                    <DropdownItem
                      key="remove-set"
                      style={Object.assign(
                        {},
                        styles.actionMenuItem,
                        setActionsDisabled ? styles.actionMenuItemDisabled(theme) : {},
                      )}
                      >
                      <Row
                        onClick={() => setActionsDisabled || dispatch(setModal(
                          <RemoveSetModal
                            enableDragging
                            field="cases.case_id"
                            filters={cardFilters}
                            RemoveFromSetButton={RemoveFromExploreCaseSetButton}
                            selected={Object.keys(get(currentAnalysis, 'sets.case', {}))[0] || ''}
                            title={`Remove ${totalFromSelectedBins} Cases from Existing Set`}
                            type="case"
                            />
                        ))}
                        >
                        Remove from existing case set
                      </Row>
                    </DropdownItem>,
                  ]}

                  {/* SAME */}
                  <DropdownItem
                    key="tsv"
                    onClick={() => downloadToTSV({
                      excludedColumns: [
                        'Select',
                        // others
                      ],
                      filename: `analysis-${
                        currentAnalysis.name}-${tsvSubstring}.${timestamp()}.tsv`,
                      selector: `#analysis-${tsvSubstring}-table`,
                    })}
                    style={{
                      ...styles.actionMenuItem,
                      borderTop: variable.active_chart !== 'box' ? `1px solid ${theme.greyScale5}` : '',
                    }}
                    >
                    Export TSV
                  </DropdownItem>
                </Dropdown>

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
                      onClick={() => {
                        if (resetCustomBinsDisabled) return;
                        dispatchUpdateClinicalVariable({
                          value: defaultContinuousData.bins,
                          variableKey: 'bins',
                        });
                        dispatchUpdateClinicalVariable({
                          value: 'default',
                          variableKey: 'continuousBinType',
                        });
                        dispatchUpdateClinicalVariable({
                          value: {},
                          variableKey: 'continuousCustomInterval',
                        });
                        dispatchUpdateClinicalVariable({
                          value: [],
                          variableKey: 'continuousCustomRanges',
                        });
                      }}
                      style={{
                        ...styles.actionMenuItem,
                        ...(resetCustomBinsDisabled
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
                headings={getHeadings(variable.active_chart, dataDimension, fieldName)}
                tableContainerStyle={{
                  height: 175,
                }}
                tableId={`analysis-${tsvSubstring}-table`}
                />
            </Column>
          </Fragment>
      )}
    </Column>
  );
};

export default compose(
  // SAME
  setDisplayName('EnhancedContinuousVariableCard'),
  connect((state: any) => ({ analysis: state.analysis })),
  withTheme,
  withState('selectedSurvivalData', 'setSelectedSurvivalData', {}),
  withState('selectedSurvivalBins', 'setSelectedSurvivalBins', []),
  withState('selectedSurvivalLoadingIds', 'setSelectedSurvivalLoadingIds', []),
  withState('survivalPlotLoading', 'setSurvivalPlotLoading', true),
  withState('selectedBins', 'setSelectedBins', []),
  // DIFFERENT - ONLY CONTINUOUS HAS QQ
  withState('qqData', 'setQQData', []),
  withState('qqDataIsSet', 'setQQDataIsSet', false),
  withPropsOnChange(
    // SAME
    (props, nextProps) => props.id !== nextProps.id,
    ({
      dispatch,
      fieldName,
      id,
    }) => ({
      dispatchUpdateClinicalVariable: ({ value, variableKey }) => {
        dispatch(
          updateClinicalAnalysisVariable({
            fieldName,
            id,
            value,
            variableKey,
          })
        );
      },
    }),
  ),
  withPropsOnChange(
    // DIFFERENT
    (props, nextProps) => !isEqual(props.data, nextProps.data),
    ({ data, fieldName }) => {
      const sanitisedId = fieldName.split('.').pop();
      const rawQueryData = get(data,
        `explore.cases.aggregations.${createFacetFieldString(fieldName)}`, data);
      const dataDimension = dataDimensions[sanitisedId] &&
        dataDimensions[sanitisedId].unit;

      return Object.assign(
        {
          boxPlotValues: map(
            // DIFFERENT - CONTINUOUS ONLY
            Object.assign(
              {},
              rawQueryData.stats,
              rawQueryData.percentiles,
            ),
            (value, stat) => {
              switch (dataDimension) {
                case 'Year': {
                  return ({
                    [stat]: parseContinuousValue(value / DAYS_IN_YEAR),
                  });
                }
                default:
                  return ({
                    [stat]: value,
                  });
              }
            }
          ).reduce((acc, item) => Object.assign({}, acc, item), {}),
          dataBuckets: get(rawQueryData, 'range.buckets', []),
          totalDocs: get(data, 'hits.total', 0),
          wrapperId: `${sanitisedId}-chart`,
        },
        dataDimensions[sanitisedId] && {
          axisTitle: dataDimensions[sanitisedId].axisTitle,
          boxPlotValues: map(
            Object.assign(
              {},
              rawQueryData.stats,
              rawQueryData.percentiles,
            ),
            (value, stat) => {
              switch (dataDimensions[sanitisedId].unit) {
                case 'Years': {
                  return ({
                    [stat]: parseContinuousValue(value / DAYS_IN_YEAR),
                  });
                }
                default:
                  return ({
                    [stat]: value,
                  });
              }
            }
          ).reduce((acc, item) => Object.assign({}, acc, item), {}),
          dataDimension: dataDimensions[sanitisedId].unit,
        },
      );
    }
  ),
  withPropsOnChange(
     // DIFFERENT
    (props, nextProps) => !isEqual(props.dataBuckets, nextProps.dataBuckets) ||
      props.setId !== nextProps.setId,
    ({
      dataBuckets,
      dispatchUpdateClinicalVariable,
      variable,
    }) => {
      dispatchUpdateClinicalVariable({
        value: variable.continuousBinType === 'default'
          ? dataBuckets.reduce((acc, curr, index) => Object.assign(
            {},
            acc,
            {
              [dataBuckets[index].key]: Object.assign(
                {},
                dataBuckets[index],
                { groupName: dataBuckets[index].key },
              ),
            },
          ), {})
          : Object.keys(variable.bins)
            .reduce((acc, curr, index) => Object.assign(
              {},
              acc,
              {
                [curr]: Object.assign(
                  {},
                  variable.bins[curr],
                  {
                    doc_count: dataBuckets[index]
                    ? dataBuckets[index].doc_count
                    : 0,
                  }
                ),
              }
            ), {}),
        variableKey: 'bins',
      });
    }
  ),
  withProps(
    // DIFFERENT
    ({
      data: { explore },
      dataBuckets,
      fieldName,
      setId,
      totalDocs,
      variable,
    }) => {
      const fieldNameUnderscores = createFacetFieldString(fieldName);

      if (!(explore &&
          explore.cases &&
          explore.cases.aggregations &&
          explore.cases.aggregations[fieldNameUnderscores])) {
        return;
      }

      const binsForBinData = explore.cases.aggregations[fieldNameUnderscores].range.buckets
        .reduce((acc, curr) => {
          const keyTrimIntegers = parseContinuousKey(curr.key).join('-');
          const currentBin = variable.bins[keyTrimIntegers] ||
              variable.bins[curr.key] ||
              { groupName: '--' };
          return Object.assign(
            {},
            acc,
            {
              [keyTrimIntegers]: {
                doc_count: curr.doc_count,
                groupName: currentBin.groupName,
                key: keyTrimIntegers,
              },
            }
          );
        }, {});

      return ({
        binData: map(groupBy(binsForBinData, bin => bin.groupName), (values, key) => ({
          doc_count: values.reduce((acc, value) => acc + value.doc_count, 0),
          key,
          keyArray: values.reduce((acc, value) => acc.concat(value.key), []),
        })).filter(bin => bin.key),
        binsOrganizedByKey: dataBuckets.reduce((acc, r) => Object.assign(
          {},
          acc,
          {
            [r.key]: Object.assign(
              {},
              r,
              {
                groupName: r.groupName !== undefined &&
                  r.groupName !== ''
                  ? r.groupName
                  : r.key,
              }
            ),
          }
        ), {}),
        getContinuousBins: (acc, { doc_count, key, keyArray }) => {
          const keyValues = parseContinuousKey(key);
          // survival doesn't have keyArray
          const keyArrayValues = keyArray
            ? parseContinuousKey(keyArray[0])
            : keyValues;

          const groupName = keyValues.length === 2 &&
            isFinite(keyValues[0]) &&
            isFinite(keyValues[1])
            ? createContinuousGroupName(key)
            : key;

          const [keyMin, keyMax] = keyArrayValues;
          const filters = {
            op: 'and',
            content: [
              {
                op: 'in',
                content: {
                  field: 'cases.case_id',
                  value: `set_id:${setId}`,
                },
              },
              {
                op: '>=',
                content: {
                  field: fieldName,
                  value: [keyMin],
                },
              },
              {
                op: '<',
                content: {
                  field: fieldName,
                  value: [keyMax],
                },
              },
            ],
          };

          return acc.concat(
            {
              chart_doc_count: doc_count,
              doc_count: getCountLink({
                doc_count,
                filters,
                totalDocs,
              }),
              filters,
              groupName,
              key: `${keyMin}-${keyMax}`,
              rangeValues: {
                max: keyMax,
                min: keyMin,
              },
            }
          );
        },
      });
    }
  ),
  withProps(({ data: { explore }, fieldName }) => {
    // DIFFERENT - CONTINUOUS ONLY
    const dataStats = explore
      ? explore.cases.aggregations[`${createFacetFieldString(fieldName)}`].stats
      : {
        Max: null,
        Min: null,
      };

    const defaultMin = dataStats.Min;
    const defaultMax = dataStats.Max + 1;
    // api excludes the max number

    const defaultQuarter = (defaultMax - defaultMin) / 4;

    const defaultNumberOfBins = 5;
    const defaultBucketSize = (defaultMax - defaultMin) / defaultNumberOfBins;

    const defaultBins = Array(defaultNumberOfBins).fill(1)
      .map((val, key) => {
        const from = key * defaultBucketSize + defaultMin;
        const to = (key + 1) === defaultNumberOfBins
          ? defaultMax
          : (defaultMin + (key + 1) * defaultBucketSize);
        const objKey = `${from}-${to}`;

        return ({
          [objKey]: {
            key: objKey,
          },
        });
      }).reduce((acc, curr) => Object.assign({}, acc, curr), {});

    return ({
      defaultContinuousData: {
        bins: defaultBins,
        max: defaultMax,
        min: defaultMin,
        quarter: defaultQuarter,
      },
    });
  }),
  withProps(
    // SLIGHTLY DIFFERENT
    ({
      dataBuckets,
      fieldName,
      filters,
      getContinuousBins,
      selectedSurvivalBins,
      setSelectedSurvivalBins,
      setSelectedSurvivalData,
      setSelectedSurvivalLoadingIds,
      setSurvivalPlotLoading,
      variable,
    }) => ({
      populateSurvivalData: () => {
        setSurvivalPlotLoading(true);
        const survivalBins = dataBuckets.length > 0
          ? dataBuckets
            .sort((a, b) => parseContinuousKey(a.key)[0] - parseContinuousKey(b.key)[0])
            .reduce(getContinuousBins, [])
          : [];

        const filteredData = survivalBins
          .filter(bucket => bucket.chart_doc_count >= MINIMUM_CASES)
          .filter(bucket => bucket.key !== '_missing');

        const default2Bins = filteredData
          .sort((a, b) => b.chart_doc_count - a.chart_doc_count)
          .slice(0, 2);

        const selectedTableBins = default2Bins
          .map(bucket => bucket.key);

        setSelectedSurvivalBins(selectedTableBins);
        setSelectedSurvivalLoadingIds(selectedTableBins);

        getSurvivalCurvesArray({
          currentFilters: filters,
          field: fieldName,
          plotType: variable.plotTypes,
          values: default2Bins,
        }).then(data => {
          setSelectedSurvivalData(data);
          setSurvivalPlotLoading(false);
          setSelectedSurvivalLoadingIds([]);
        });
      },
      updateSelectedSurvivalBins: (data, bin) => {
        if (
          selectedSurvivalBins.indexOf(bin.key) === -1 &&
          selectedSurvivalBins.length >= MAXIMUM_CURVES
        ) {
          return;
        }
        setSurvivalPlotLoading(true);

        const nextValues =
          selectedSurvivalBins.indexOf(bin.key) === -1
            ? selectedSurvivalBins.concat(bin.key)
            : selectedSurvivalBins.filter(s => s !== bin.key);

        setSelectedSurvivalBins(nextValues);
        setSelectedSurvivalLoadingIds(nextValues);

        const binsForPlot = nextValues
          .map(v => data.filter(d => d.key === v)[0])
          .map(filteredData => Object.assign(
            {},
            filteredData,
            { doc_count: 0 },
          ));

        getSurvivalCurvesArray({
          currentFilters: filters,
          field: fieldName,
          plotType: variable.plotTypes,
          values: binsForPlot,
        }).then(receivedData => {
          setSelectedSurvivalData(receivedData);
          setSurvivalPlotLoading(false);
          setSelectedSurvivalLoadingIds([]);
        });
      },
    })
  ),
  withPropsOnChange(
    // SAME
    (props, nextProps) => (props.variable.active_chart !== nextProps.variable.active_chart ||
      !isEqual(props.variable.bins, nextProps.variable.bins) ||
      // reset or customized bins
      !isEqual(props.data, nextProps.data)) &&
      // changed cohort
      nextProps.variable.active_chart === 'survival',
    ({ populateSurvivalData }) => { console.log('im updating!'); populateSurvivalData(); }
  ),
  withPropsOnChange(
    // SAME
    (props, nextProps) => props.id !== nextProps.id,
    ({ setSelectedBins }) => setSelectedBins([])
  ),
  withPropsOnChange(
    // DIFFERENT
    (props, nextProps) => props.variable.continuousBinType !== nextProps.variable.continuousBinType,
    ({ variable: { continuousBinType } }) => ({
      resetCustomBinsDisabled: continuousBinType === 'default',
    })
  ),
  withPropsOnChange(
    (props, nextProps) => props.variable.continuousBinType !== nextProps.variable.continuousBinType ||
    !isEqual(props.variable.continuousCustomInterval, nextProps.variable.continuousCustomInterval) ||
    !isEqual(props.variable.continuousCustomRanges, nextProps.variable.continuousCustomRanges) ||
    !isEqual(props.defaultContinuousData, nextProps.defaultContinuousData),
    ({
      defaultContinuousData,
      dispatch,
      dispatchUpdateClinicalVariable,
      fieldName,
      variable,
    }) => ({
      openCustomBinModal: () => dispatch(setModal(
        <ContinuousCustomBinsModal
          continuousBinType={variable.continuousBinType}
          continuousCustomInterval={variable.continuousCustomInterval}
          continuousCustomRanges={variable.continuousCustomRanges}
          defaultContinuousData={defaultContinuousData}
          fieldName={humanify({ term: fieldName })}
          onClose={() => dispatch(setModal(null))}
          onUpdate={(
            newBins,
            continuousBinType,
            continuousCustomInterval,
            continuousCustomRanges,
            continuousReset,
          ) => {
            dispatchUpdateClinicalVariable({
              value: continuousReset
                ? defaultContinuousData.bins
                : newBins,
              variableKey: 'bins',
            });
            dispatchUpdateClinicalVariable({
              value: continuousReset
                ? 'default'
                : continuousBinType,
              variableKey: 'continuousBinType',
            });
            !continuousReset &&
              continuousBinType === 'interval' &&
              (
                dispatchUpdateClinicalVariable({
                  value: continuousCustomInterval,
                  variableKey: 'continuousCustomInterval',
                })
              );
            !continuousReset &&
              continuousBinType === 'range' &&
              (
                dispatchUpdateClinicalVariable({
                  value: continuousCustomRanges,
                  variableKey: 'continuousCustomRanges',
                })
              );
            continuousReset &&
              (
                dispatchUpdateClinicalVariable({
                  value: [],
                  variableKey: 'continuousCustomRanges',
                })
              );
            continuousReset &&
              (
                dispatchUpdateClinicalVariable({
                  value: {},
                  variableKey: 'continuousCustomInterval',
                })
              );
            dispatch(setModal(null));
          }}
          />
      )),
    })
  ),
  lifecycle({
    // SAME
    componentDidMount(): void {
      const {
        binsOrganizedByKey,
        dispatchUpdateClinicalVariable,
        variable,
        wrapperId,
      } = this.props;
      if (variable.bins === undefined || isEmpty(variable.bins)) {
        dispatchUpdateClinicalVariable({
          value: binsOrganizedByKey,
          variableKey: 'bins',
        });
      }
      if (variable.scrollToCard === false) return;
      const offset = document.getElementById('header').getBoundingClientRect().bottom + 10;
      const $anchor = document.getElementById(`${wrapperId}-container`);
      if ($anchor) {
        const offsetTop = $anchor.getBoundingClientRect().top + window.pageYOffset;
        window.scroll({
          behavior: 'smooth',
          top: offsetTop - offset,
        });
      }

      dispatchUpdateClinicalVariable({
        value: false,
        variableKey: 'scrollToCard',
      });
    },
  })
)(ContinuousVariableCard);
