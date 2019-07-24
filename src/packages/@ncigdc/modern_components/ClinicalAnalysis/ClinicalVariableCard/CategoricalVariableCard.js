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
  reduce,
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
import { makeFilter } from '@ncigdc/utils/filters';
import { CreateExploreCaseSetButton, AppendExploreCaseSetButton, RemoveFromExploreCaseSetButton } from '@ncigdc/modern_components/withSetAction';

import { setModal } from '@ncigdc/dux/modal';
import SaveSetModal from '@ncigdc/components/Modals/SaveSetModal';
import AppendSetModal from '@ncigdc/components/Modals/AppendSetModal';
import RemoveSetModal from '@ncigdc/components/Modals/RemoveSetModal';
import GroupValuesModal from '@ncigdc/components/Modals/GroupValuesModal';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import wrapSvg from '@ncigdc/utils/wrapSvg';
import { downloadToTSV } from '@ncigdc/components/DownloadTableToTsvButton';

import {
  getSurvivalCurvesArray,
  MAXIMUM_CURVES,
  MINIMUM_CASES,
} from '@ncigdc/utils/survivalplot';
import '../survivalPlot.css';
import {
  SpinnerIcon,
  CloseIcon,
  SurvivalIcon,
  BarChartIcon,
} from '@ncigdc/theme/icons';
import { withTheme } from '@ncigdc/theme';

import {
  removeClinicalAnalysisVariable,
  updateClinicalAnalysisVariable,
} from '@ncigdc/dux/analysis';
import {
  humanify,
  createFacetFieldString,
} from '@ncigdc/utils/string';
import termCapitaliser from '@ncigdc/utils/customisation';
import timestamp from '@ncigdc/utils/timestamp';

import { IS_CDAVE_DEV } from '@ncigdc/utils/constants';
import ClinicalHistogram from './ClinicalHistogram';
import ClinicalSurvivalPlot from './ClinicalSurvivalPlot';

import {
  colors,
  dataDimensions,
  getCardFilters,
  getCountLink,
  getHeadings,
} from './helpers';

interface ITableHeading {
  key: string;
  title: string;
  style?: React.CSSProperties;
}

type TPlotType = 'categorical';
type TActiveChart = 'survival' | 'histogram';
type TActiveCalculation = 'number' | 'percentage';
type TVariableType =
  | 'Demographic'
  | 'Diagnosis'
  | 'Exposure'
  | 'Treatment'
  | 'Follow_up' // confirm type name
  | 'Molecular_test'; // confirm type name

interface IVariable {
  bins: any[]; // tbd - bins still need spec
  active_calculation: TActiveCalculation;
  active_chart: TActiveChart;
  plotTypes: TPlotType;
  type: TVariableType;
}

interface IVariableCardProps {
  variable: IVariable;
  fieldName: string;
  plots: any[];
  style: React.CSSProperties;
  theme: IThemeProps;
  dispatch: (arg: any) => void;
  id: string;
  survivalData: any[];
}

interface IVizButton {
  title: string;
  icon: JSX.Element;
  action: (
    payload: IAnalysisPayload
  ) => { type: string, payload: IAnalysisPayload };
}

interface IVizButtons {
  survival: IVizButton;
  histogram: IVizButton;
  delete: IVizButton;
}

const styles = {
  actionMenuItem: {
    cursor: 'pointer',
    lineHeight: '1.5',
  },
  actionMenuItemDisabled: (theme: IThemeProps) => ({
    ':hover': {
      backgroundColor: 'transparent',
      color: theme.greyScale5,
      cursor: 'not-allowed',
    },
    color: theme.greyScale5,
    cursor: 'not-allowed',
  }),
  activeButton: (theme: IThemeProps) => ({
    ...styles.common(theme),
    backgroundColor: theme.primary,
    border: `1px solid ${theme.primary}`,
    color: '#fff',
  }),
  chartIcon: {
    height: '14px',
    width: '14px',
  },
  common: (theme: IThemeProps) => ({
    ':hover': {
      backgroundColor: 'rgb(0,138,224)',
      border: '1px solid rgb(0,138,224)',
      color: '#fff',
    },
    backgroundColor: 'transparent',
    border: `1px solid ${theme.greyScale4}`,
    color: theme.greyScale2,
    justifyContent: 'flex-start',
  }),
  histogram: (theme: IThemeProps) => ({
    axis: {
      fontSize: '1.1rem',
      fontWeight: '500',
      stroke: theme.greyScale4,
      textFill: theme.greyScale3,
    },
  }),
};


const vizButtons: IVizButtons = {
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

const getTableData = (
  binData,
  fieldName,
  selectedBuckets,
  selectedSurvivalLoadingIds,
  selectedSurvivalValues,
  setId,
  setSelectedBuckets,
  totalDocs,
  updateSelectedSurvivalValues,
  variable,
) => {
  if (isEmpty(binData)) {
    return [];
  }

  const displayData = binData
    .filter(bucket => (
      IS_CDAVE_DEV
        ? bucket.key
        : bucket.key !== '_missing'
    ))
    .sort((a, b) => b.doc_count - a.doc_count)
    .map(bin => Object.assign(
      {},
      bin,
      {
        chart_doc_count: bin.doc_count,
        doc_count: getCountLink({
          doc_count: bin.doc_count,
          filters:
            bin.key === '_missing'
              ? {
                content: [
                  {
                    content: {
                      field: fieldName,
                      value: bin.keyArray,
                    },
                    op: 'IS',
                  },
                  {
                    content: {
                      field: 'cases.case_id',
                      value: `set_id:${setId}`,
                    },
                    op: 'in',
                  },
                ],
                op: 'AND',
              }
              : makeFilter([
                {
                  field: 'cases.case_id',
                  value: `set_id:${setId}`,
                },
                {
                  field: fieldName,
                  value: bin.keyArray,
                },
              ]),
          totalDocs,
        }),
        key: bin.key,
      }
    ));

  return displayData.map(bin => Object.assign(
    {},
    bin,
    {
      select: (
        <input
          aria-label={`${fieldName} ${bin.key}`}
          checked={!!find(selectedBuckets, { key: bin.key })}
          disabled={bin.doc_count === 0}
          id={`${fieldName}-${bin.key}`}
          onChange={() => {
            if (find(selectedBuckets, { key: bin.key })) {
              setSelectedBuckets(
                reject(selectedBuckets, r => r.key === bin.key)
              );
            } else {
              setSelectedBuckets(selectedBuckets.concat(bin));
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
      survival: (
        <Tooltip
          Component={
            bin.key === '_missing' || bin.chart_doc_count < MINIMUM_CASES
              ? 'Not enough data'
              : selectedSurvivalValues.indexOf(bin.key) > -1
                ? `Click icon to remove "${bin.groupName || bin.key}"`
                : selectedSurvivalValues.length < MAXIMUM_CURVES
                  ? `Click icon to plot "${bin.groupName || bin.key}"`
                  : `Maximum plots (${MAXIMUM_CURVES}) reached`
          }
          >
          <Button
            disabled={
              bin.key === '_missing' ||
              bin.chart_doc_count < MINIMUM_CASES ||
              (selectedSurvivalValues.length >= MAXIMUM_CURVES &&
                selectedSurvivalValues.indexOf(bin.key) === -1)
            }
            onClick={() => {
              updateSelectedSurvivalValues(displayData, bin);
            }}
            style={{
              backgroundColor:
                selectedSurvivalValues.indexOf(bin.key) === -1
                  ? '#666'
                  : colors(selectedSurvivalValues.indexOf(bin.key)),
              color: 'white',
              margin: '0 auto',
              opacity:
                bin.key === '_missing' ||
                  bin.chart_doc_count < MINIMUM_CASES ||
                  (selectedSurvivalValues.length >= MAXIMUM_CURVES &&
                    selectedSurvivalValues.indexOf(bin.key) === -1)
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

const CategoricalVariableCard: React.ComponentType<IVariableCardProps> = ({
  binData,
  currentAnalysis,
  dataBuckets,
  dataDimension,
  dispatch,
  fieldName,
  filters,
  id,
  overallSurvivalData,
  plots,
  resetCustomBinsDisabled,
  selectedBuckets,
  selectedSurvivalData,
  selectedSurvivalLoadingIds,
  selectedSurvivalValues,
  setId,
  setSelectedBuckets,
  style = {},
  survivalPlotLoading,
  theme,
  totalDocs,
  updateSelectedSurvivalValues,
  variable,
  wrapperId,
}) => {
  const tableData = getTableData(
    binData,
    fieldName,
    selectedBuckets,
    selectedSurvivalLoadingIds,
    selectedSurvivalValues,
    setId,
    setSelectedBuckets,
    totalDocs,
    updateSelectedSurvivalValues,
    variable,
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

  // set action will default to cohort total when no buckets are selected
  const totalFromSelectedBuckets = selectedBuckets && selectedBuckets.length
    ? selectedBuckets.reduce((acc, bin) => acc + bin.chart_doc_count, 0)
    : totalDocs;

  const tsvSubstring = fieldName.replace(/\./g, '-');
  const cardFilters = getCardFilters(variable.plotTypes, selectedBuckets, fieldName, filters);
  const setActionsDisabled = get(selectedBuckets, 'length', 0) === 0;
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
                        onChange={() => dispatch(
                          updateClinicalAnalysisVariable({
                            fieldName,
                            id,
                            value: 'percentage',
                            variableKey: 'active_calculation',
                          })
                        )}
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
                        onChange={() => dispatch(
                          updateClinicalAnalysisVariable({
                            fieldName,
                            id,
                            value: 'number',
                            variableKey: 'active_calculation',
                          })
                        )}
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

              {variable.active_chart === 'histogram' && (
                <ClinicalHistogram
                  active_calculation={variable.active_calculation}
                  histogramData={histogramData}
                  histogramStyles={styles.histogram}
                  theme={theme}
                  type={variable.type}
                  />
              )}

              {variable.active_chart === 'survival' && (
                <ClinicalSurvivalPlot
                  plotType={selectedSurvivalValues.length === 0
                    ? 'clinicalOverall'
                    : 'categorical'}
                  survivalData={selectedSurvivalValues.length === 0
                    ? overallSurvivalData
                    : selectedSurvivalData}
                  survivalPlotLoading={survivalPlotLoading}
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
                          title={`Save ${totalFromSelectedBuckets} Cases as New Set`}
                          total={totalFromSelectedBuckets}
                          type="case"
                          />
                      ))}
                      >
                      Save as new case set
                    </Row>
                  </DropdownItem>
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
                          title={`Add ${totalFromSelectedBuckets} Cases to Existing Set`}
                          total={totalFromSelectedBuckets}
                          type="case"
                          />
                      ))}
                      >
                      Add to existing case set
                    </Row>
                  </DropdownItem>
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
                          title={`Remove ${totalFromSelectedBuckets} Cases from Existing Set`}
                          type="case"
                          />
                      ))}
                      >
                      Remove from existing case set
                    </Row>
                  </DropdownItem>
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
                      borderTop: `1px solid ${theme.greyScale5}`,
                    }}
                    >
                    Export TSV
                  </DropdownItem>
                </Dropdown>

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
                    onClick={() => dispatch(setModal(
                      <GroupValuesModal
                        bins={variable.bins}
                        dataBuckets={dataBuckets}
                        fieldName={humanify({ term: fieldName })}
                        modalStyle={{
                          maxWidth: '720px',
                          width: '90%',
                        }}
                        onClose={() => dispatch(setModal(null))}
                        onUpdate={(newBins) => {
                          dispatch(
                            updateClinicalAnalysisVariable({
                              fieldName,
                              id,
                              value: newBins,
                              variableKey: 'bins',
                            }),
                          );
                          dispatch(setModal(null));
                        }}
                        />
                    ))}
                    style={styles.actionMenuItem}
                    >
                    Edit Bins
                  </DropdownItem>

                  <DropdownItem
                    onClick={() => {
                      if (resetCustomBinsDisabled) return;
                      dispatch(
                        updateClinicalAnalysisVariable({
                          fieldName,
                          id,
                          value: dataBuckets
                            .reduce((acc, r) => Object.assign(
                              {},
                              acc,
                              {
                                [r.key]: Object.assign(
                                  {},
                                  r,
                                  { groupName: r.key }
                                ),
                              }
                            ), {}),
                          variableKey: 'bins',
                        }),
                      );
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
              </Row>

              <EntityPageHorizontalTable
                data={tableData.map(tableRow => Object.assign(
                  {},
                  tableRow,
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
  setDisplayName('EnhancedCategoricalVariableCard'),
  connect((state: any) => ({ analysis: state.analysis })),
  withTheme,
  withState('selectedSurvivalData', 'setSelectedSurvivalData', {}),
  withState('selectedSurvivalValues', 'setSelectedSurvivalValues', []),
  withState('selectedSurvivalLoadingIds', 'setSelectedSurvivalLoadingIds', []),
  withState('survivalPlotLoading', 'setSurvivalPlotLoading', true),
  withState('selectedBuckets', 'setSelectedBuckets', []),
  withPropsOnChange(
    (props, nextProps) => !isEqual(props.data, nextProps.data),
    ({ data, fieldName }) => {
      const sanitisedId = fieldName.split('.').pop();
      const rawQueryData = get(data,
        `explore.cases.aggregations.${createFacetFieldString(fieldName)}`, data);

      return Object.assign(
        {
          dataBuckets: get(rawQueryData, 'buckets', []),
          totalDocs: get(data, 'hits.total', 0),
          wrapperId: `${sanitisedId}-chart`,
        },
        dataDimensions[sanitisedId] && {
          axisTitle: dataDimensions[sanitisedId].axisTitle,
          dataDimension: dataDimensions[sanitisedId].unit,
        },
      );
    }
  ),
  withPropsOnChange(
    (props, nextProps) => !isEqual(props.dataBuckets, nextProps.dataBuckets) ||
      props.setId !== nextProps.setId,
    ({
      dataBuckets,
      dispatch,
      fieldName,
      id,
      variable,
    }) => {
      dispatch(
        updateClinicalAnalysisVariable({
          fieldName,
          id,
          value: Object.assign(
            {},
            reduce(variable.bins, (acc, bin, key) => Object.assign(
              {},
              acc,
              bin.groupName && bin.groupName !== key
                ? {
                  [key]: {
                    doc_count: 0,
                    groupName: bin.groupName,
                    key,
                  },
                }
                : {}
            ), {}),
            dataBuckets.reduce((acc, bucket) => Object.assign(
              {},
              acc,
              {
                [bucket.key]: Object.assign(
                  {},
                  bucket,
                  {
                    groupName:
                    typeof get(variable, `bins.${bucket.key}.groupName`, undefined) === 'string'
                      // hidden value have groupName '', so check if it is string
                      ? get(variable, `bins.${bucket.key}.groupName`, undefined)
                      : bucket.key,
                  },
                ),
              }
            ), {}),
          ),
          variableKey: 'bins',
        }),
      );
    }
  ),
  withProps(
    ({
      dataBuckets,
      variable,
    }) => ({
      binData: map(groupBy(variable.bins, bin => bin.groupName), (values, key) => ({
        doc_count: values.reduce((acc, value) => acc + value.doc_count, 0),
        key,
        keyArray: values.reduce((acc, value) => acc.concat(value.key), []),
      })).filter(bin => bin.key),
      bucketsOrganizedByKey: dataBuckets
        .reduce((acc, bucket) => Object.assign(
          {},
          acc,
          {
            [bucket.key]: Object.assign(
              {},
              bucket,
              {
                groupName: bucket.groupName !== undefined &&
                bucket.groupName !== ''
                ? bucket.groupName
                : bucket.key,
              }
            ),
          }
        ), {}),
    })
  ),
  withProps(
    // SLIGHTLY DIFFERENT
    ({
      binData,
      fieldName,
      filters,
      selectedSurvivalValues,
      setSelectedSurvivalData,
      setSelectedSurvivalLoadingIds,
      setSelectedSurvivalValues,
      setSurvivalPlotLoading,
      variable,
    }) => ({
      populateSurvivalData: () => {
        setSurvivalPlotLoading(true);
        const dataForSurvival = binData
          .filter(bucket => (IS_CDAVE_DEV ? bucket.key : bucket.key !== '_missing'))
          .map(bucket => Object.assign(
            {},
            bucket,
            { chart_doc_count: bucket.doc_count }
          ));

        const filteredData = dataForSurvival
          .filter(x => x.chart_doc_count >= MINIMUM_CASES)
          .filter(x => x.key !== '_missing')
          .sort((a, b) => b.chart_doc_count - a.chart_doc_count);

        const valuesForTable = filteredData.map(d => d.key).slice(0, 2);

        const valuesForPlot = filteredData
          .map(d => d.keyArray).slice(0, 2);

        setSelectedSurvivalValues(valuesForTable);
        setSelectedSurvivalLoadingIds(valuesForTable);

        getSurvivalCurvesArray({
          currentFilters: filters,
          field: fieldName,
          plotType: variable.plotTypes,
          values: valuesForPlot,
        }).then(data => {
          setSelectedSurvivalData(data);
          setSurvivalPlotLoading(false);
          setSelectedSurvivalLoadingIds([]);
        });
      },
      updateSelectedSurvivalValues: (data, value) => {
        if (
          selectedSurvivalValues.indexOf(value.key) === -1 &&
          selectedSurvivalValues.length >= MAXIMUM_CURVES
        ) {
          return;
        }
        setSurvivalPlotLoading(true);

        const nextValues =
          selectedSurvivalValues.indexOf(value.key) === -1
            ? selectedSurvivalValues.concat(value.key)
            : selectedSurvivalValues.filter(s => s !== value.key);

        setSelectedSurvivalValues(nextValues);
        setSelectedSurvivalLoadingIds(nextValues);

        getSurvivalCurvesArray({
          currentFilters: filters,
          field: fieldName,
          plotType: variable.plotTypes,
          values: nextValues,
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
    (props, nextProps) => props.variable.active_chart !== nextProps.variable.active_chart ||
      !isEqual(props.data, nextProps.data) ||
      !isEqual(props.variable.bins, nextProps.variable.bins),
    ({ populateSurvivalData, variable }) => {
      if (variable.active_chart === 'survival') {
        populateSurvivalData();
      }
    }
  ),
  withPropsOnChange(
    // SAME
    (props, nextProps) => props.id !== nextProps.id,
    ({ setSelectedBuckets }) => setSelectedBuckets([])
  ),
  withPropsOnChange(
    // DIFFERENT
    (props, nextProps) => !isEqual(props.variable.bins, nextProps.variable.bins),
    ({ variable: { bins } }) => ({
      resetCustomBinsDisabled: Object.keys(bins)
        .filter(bin => bins[bin].key !== bins[bin].groupName)
        .length === 0,
    })
  ),
  lifecycle({
    // SAME
    componentDidMount(): void {
      const {
        bucketsOrganizedByKey,
        dispatch,
        fieldName,
        id,
        variable,
        wrapperId,
      } = this.props;
      if (variable.bins === undefined || isEmpty(variable.bins)) {
        dispatch(
          updateClinicalAnalysisVariable({
            fieldName,
            id,
            value: bucketsOrganizedByKey,
            variableKey: 'bins',
          }),
        );
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

      dispatch(
        updateClinicalAnalysisVariable({
          fieldName,
          id,
          value: false,
          variableKey: 'scrollToCard',
        })
      );
    },
  })
)(CategoricalVariableCard);
