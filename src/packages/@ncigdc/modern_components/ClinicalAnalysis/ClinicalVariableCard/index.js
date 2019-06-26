import React from 'react';
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
  max,
  min,
  reduce,
  reject,
  sortBy,
  truncate,
} from 'lodash';
import { scaleOrdinal, schemeCategory10 } from 'd3';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { Tooltip, TooltipInjector } from '@ncigdc/uikit/Tooltip';
import { visualizingButton, zDepth1 } from '@ncigdc/theme/mixins';

import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Hidden from '@ncigdc/components/Hidden';
import BarChart from '@ncigdc/components/Charts/BarChart';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';
import { CreateExploreCaseSetButton, AppendExploreCaseSetButton, RemoveFromExploreCaseSetButton } from '@ncigdc/modern_components/withSetAction';

import { setModal } from '@ncigdc/dux/modal';
import SaveSetModal from '@ncigdc/components/Modals/SaveSetModal';
import AppendSetModal from '@ncigdc/components/Modals/AppendSetModal';
import RemoveSetModal from '@ncigdc/components/Modals/RemoveSetModal';
import GroupValuesModal from '@ncigdc/components/Modals/GroupValuesModal';
import DownloadVisualizationButton from '@ncigdc/components/DownloadVisualizationButton';
import wrapSvg from '@ncigdc/utils/wrapSvg';
import {
  DAYS_IN_YEAR,
} from '@ncigdc/utils/ageDisplay';
import { downloadToTSV } from '@ncigdc/components/DownloadTableToTsvButton';
import QQPlotQuery from '@ncigdc/modern_components/QQPlot/QQPlotQuery';
import BoxPlotWrapper from '@oncojs/boxplot';

// survival plot
import SurvivalPlotWrapper from '@ncigdc/components/SurvivalPlotWrapper';
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
  BoxPlot,
} from '@ncigdc/theme/icons';
import { withTheme } from '@ncigdc/theme';

import {
  removeClinicalAnalysisVariable,
  updateClinicalAnalysisVariable,
} from '@ncigdc/dux/analysis';
import { humanify } from '@ncigdc/utils/string';
import timestamp from '@ncigdc/utils/timestamp';

import { IS_CDAVE_DEV } from '@ncigdc/utils/constants';
import ContinuousCustomBinsModal from '@ncigdc/components/Modals/ContinuousBinning/ContinuousCustomBinsModal';
import {
  boxTableAllowedStats,
  boxTableRenamedStats,
  dataDimensions,
} from './helpers';

import '../boxplot.css';
import '../qq.css';

const colors = scaleOrdinal(schemeCategory10);

interface ITableHeading {
  key: string;
  title: string;
  style?: React.CSSProperties;
}

type TPlotType = 'categorical' | 'continuous';
type TActiveChart = 'box' | 'survival' | 'histogram';
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
  box: IVizButton;
  delete: IVizButton;
}

const CHART_HEIGHT = 250;
const QQ_PLOT_RATIO = '70%';
const BOX_PLOT_RATIO = '30%';

const vizButtons: IVizButtons = {
  box: {
    action: updateClinicalAnalysisVariable,
    icon: (
      <BoxPlot
        style={{
          height: '1em',
          width: '1em',
        }}
      />),
    title: 'Box/QQ Plot',
  },
  delete: {
    action: removeClinicalAnalysisVariable,
    icon: (
      <CloseIcon
        style={{
          height: '1em',
          width: '1em',
        }}
      />),
    title: 'Remove Card',
  },
  histogram: {
    action: updateClinicalAnalysisVariable,
    icon: (
      <BarChartIcon
        style={{
          height: '1em',
          width: '1em',
        }}
      />),
    title: 'Histogram',
  },
  survival: {
    action: updateClinicalAnalysisVariable,
    icon: <SurvivalIcon style={{ height: '1em' }} />,
    title: 'Survival Plot',
  },
};

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
      fontSize: '0.9rem',
      fontWeight: '500',
      stroke: theme.greyScale4,
      textFill: theme.greyScale3,
    },
  }),
};

const parseContinuousBucketValue = value => (value % 1
  ? value
  : Math.round(value * 100) / 100);

const getContinuousRangeValue = keyValues => {
  const keyValuesParsed = keyValues
    .map(val => parseContinuousBucketValue(val));
  return `${keyValuesParsed[0]} to ${keyValuesParsed[1]}`;
};

const getCountLink = ({ doc_count, filters, totalDocs }) => (
  <span>
    <ExploreLink
      query={{
        filters,
        searchTableTab: 'cases',
      }}
    >
      {(doc_count || 0).toLocaleString()}
    </ExploreLink>
    <span>{` (${(((doc_count || 0) / totalDocs) * 100).toFixed(2)}%)`}</span>
  </span>
);

const getCategoricalSetFilters = (selectedBuckets, fieldName, filters) => {
  const bucketFilters = []
    .concat(selectedBuckets.filter(bucket => bucket.key !== '_missing').length > 0 && [
      {
        content: {
          field: fieldName,
          value: selectedBuckets
            .filter(bucket => bucket.key !== '_missing')
            .reduce((acc, selectedBucket) => [...acc, ...selectedBucket.keyArray], []),
        },
        op: 'in',
      },
    ])
    .concat(selectedBuckets.some(bucket => bucket.key === '_missing') && [
      {
        content: {
          field: fieldName,
          value: 'MISSING',
        },
        op: 'is',
      },
    ])
    .filter(item => item);

  return Object.assign(
    {},
    filters,
    bucketFilters.length && {
      content: filters.content
        .concat(
          bucketFilters.length > 1
            ? {
              content: bucketFilters,
              op: 'or',
            }
            : bucketFilters[0]
        ),
    }
  );
};

const getContinuousSetFilters = (selectedBuckets, fieldName, filters) => {
  const bucketRanges = selectedBuckets.map(b => b.rangeValues);
  if (bucketRanges.length === 1 && bucketRanges[0].max === -1) {
    return addInFilters(filters, {
      content: [
        {
          content: {
            field: fieldName,
            value: [bucketRanges[0].min],
          },
          op: '>=',
        },
      ],
      op: 'and',
    });
  }
  return addInFilters(filters, {
    content: [
      {
        content: {
          field: fieldName,
          value: [min(bucketRanges.map(range => range.min))],
        },
        op: '>=',
      },
      {
        content: {
          field: fieldName,
          value: [max(bucketRanges.map(range => range.max))],
        },
        op: '<=',
      },
    ],
    op: 'and',
  });
};

const getCardFilters = (variablePlotTypes, selectedBuckets, fieldName, filters) => {
  return (get(selectedBuckets, 'length', 0)
    ? variablePlotTypes === 'continuous'
      ? getContinuousSetFilters(selectedBuckets, fieldName, filters)
      : getCategoricalSetFilters(selectedBuckets, fieldName, filters)
    : filters);
};

const getTableData = (
  binData,
  getContinuousBuckets,
  fieldName,
  totalDocs,
  selectedSurvivalValues,
  setId,
  selectedBuckets,
  setSelectedBuckets,
  variable,
  updateSelectedSurvivalValues,
  selectedSurvivalLoadingIds,
) => {
  if (isEmpty(binData)) {
    return [];
  }

  const displayData = variable.plotTypes === 'continuous'
    ? binData
      .sort((a, b) => a.keyArray[0] - b.keyArray[0])
      .reduce(getContinuousBuckets, [])
    : binData
      .filter(bucket => (IS_CDAVE_DEV ? bucket.key : bucket.key !== '_missing'))
      .sort((a, b) => b.doc_count - a.doc_count)
      .map(b => ({
        ...b,
        chart_doc_count: b.doc_count,
        doc_count: getCountLink({
          doc_count: b.doc_count,
          filters:
            b.key === '_missing'
              ? {
                content: [
                  {
                    content: {
                      field: fieldName,
                      value: [...b.keyArray],
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
                  value: [...b.keyArray],
                },
              ]),
          totalDocs,
        }),
        key: b.key,
      }));

  return displayData.map(b => ({
    ...b,
    select: (
      <input
        aria-label={`${fieldName}-${b.key}`}
        checked={!!find(selectedBuckets, { key: b.key })}
        disabled={b.doc_count === 0}
        id={b.key}
        onChange={() => {
          if (find(selectedBuckets, { key: b.key })) {
            setSelectedBuckets(
              reject(selectedBuckets, r => r.key === b.key)
            );
          } else {
            setSelectedBuckets([...selectedBuckets, b]);
          }
        }}
        style={{
          marginLeft: 3,
          pointerEvents: 'initial',
        }}
        type="checkbox"
        value={b.key}
      />
    ),
    ...(variable.active_chart === 'survival'
      ? {
        survival: (
          <Tooltip
            Component={
              b.key === '_missing' || b.chart_doc_count < MINIMUM_CASES
                ? 'Not enough data'
                : selectedSurvivalValues.indexOf(b.key) > -1
                  ? `Click icon to remove ${b.key}`
                  : selectedSurvivalValues.length < MAXIMUM_CURVES
                    ? `Click icon to plot ${b.key}`
                    : `Maximum plots (${MAXIMUM_CURVES}) reached`
            }
          >
            <Button
              disabled={
                b.key === '_missing' ||
                b.chart_doc_count < MINIMUM_CASES ||
                (selectedSurvivalValues.length >= MAXIMUM_CURVES &&
                  selectedSurvivalValues.indexOf(b.key) === -1)
              }
              onClick={() => {
                updateSelectedSurvivalValues(displayData, b);
              }}
              style={{
                backgroundColor:
                  selectedSurvivalValues.indexOf(b.key) === -1
                    ? '#666'
                    : colors(selectedSurvivalValues.indexOf(b.key)),
                color: 'white',
                margin: '0 auto',
                opacity:
                  b.key === '_missing' ||
                    b.chart_doc_count < MINIMUM_CASES ||
                    (selectedSurvivalValues.length >= MAXIMUM_CURVES &&
                      selectedSurvivalValues.indexOf(b.key) === -1)
                    ? '0.33'
                    : '1',
                padding: '2px 3px',
                position: 'static',
              }}
            >
              {selectedSurvivalLoadingIds.indexOf(b.key) !== -1 ? (
                <SpinnerIcon />
              ) : (
                  <SurvivalIcon />
                )}
            </Button>
          </Tooltip>
        ),
      }
      : {}),
  }));
};

const getBoxTableData = (data = {}) => (
  Object.keys(data).length
    ? sortBy(Object.keys(data), datum => boxTableAllowedStats.indexOf(datum.toLowerCase()))
      .reduce(
        (tableData, stat) => (
          boxTableAllowedStats.includes(stat.toLowerCase())
            ? tableData.concat({
              count: data[stat],
              stat: boxTableRenamedStats[stat] || stat, // Shows the descriptive label
            })
            : tableData
        ), []
      )
    : []
);

const getHeadings = (chartType, dataDimension, fieldName) => {
  return chartType === 'box'
    ? [
      {
        key: 'stat',
        title: 'Statistics',
      },
      {
        key: 'count',
        style: { textAlign: 'right' },
        title: `${dataDimension || 'Quantities'}`,
      },
    ]
    : [
      {
        key: 'select',
        thStyle: {
          position: 'sticky',
          top: 0,
        },
        title: 'Select',
      },
      {
        key: 'key',
        thStyle: {
          position: 'sticky',
          top: 0,
        },
        title: humanify({ term: fieldName }),
      },
      {
        key: 'doc_count',
        style: { textAlign: 'right' },
        thStyle: {
          position: 'sticky',
          textAlign: 'right',
          top: 0,
        },
        title: '# Cases',
      },
      ...(chartType === 'survival' ? [
        {
          key: 'survival',
          style: {
            display: 'flex',
            justifyContent: 'flex-end',
          },
          thStyle: {
            position: 'sticky',
            textAlign: 'right',
            top: 0,
          },
          title: 'Survival',
        },
      ] : []),
    ];
};

const ClinicalVariableCard: React.ComponentType<IVariableCardProps> = ({
  currentAnalysis,
  binData,
  dataBuckets,
  dataDimension,
  dataValues,
  defaultData,
  dispatch,
  fieldName,
  filters,
  getContinuousBuckets,
  id,
  bucketsOrganizedByKey,
  overallSurvivalData,
  plots,
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
  qqData,
  setQQData,
  setQQDataIsSet,
}) => {
  const tableData = variable.active_chart === 'box'
    ? getBoxTableData(dataValues)
    : getTableData(
      binData,
      getContinuousBuckets,
      fieldName,
      totalDocs,
      selectedSurvivalValues,
      setId,
      selectedBuckets,
      setSelectedBuckets,
      variable,
      updateSelectedSurvivalValues,
      selectedSurvivalLoadingIds,
    );

  const chartData =
    variable.active_chart === 'histogram'
      ? tableData.map(d => {
        return {
          fullLabel: d.groupName || d.key,
          label: truncate(d.groupName || d.key, { length: 18 }),
          tooltip: `${d.key}: ${d.chart_doc_count.toLocaleString()}`,
          value:
            variable.active_calculation === 'number'
              ? d.chart_doc_count
              : (d.chart_doc_count / totalDocs) * 100,
        };
      })
      : [];

  // set action will default to cohort total when no buckets are selected
  const totalFromSelectedBuckets = selectedBuckets && selectedBuckets.length
    ? selectedBuckets.reduce((acc, b) => acc + b.chart_doc_count, 0)
    : totalDocs;

  const tsvSubstring = fieldName.replace(/\./g, '-');
  const cardFilters = getCardFilters(variable.plotTypes, selectedBuckets, fieldName, filters);
  const setActionsDisabled = get(selectedBuckets, 'length', 0) === 0;

  const checkIfContinuousBinsAreDefault = () => {
    const defaultGroupNames = Object.keys(defaultData.buckets)
      .map(bucket => defaultData.buckets[bucket].groupName);
    const currentGroupNames = binData.map(bin => bin.key);

    const defaultRanges = Object.keys(defaultData.buckets)
      .map(bucket => defaultData.buckets[bucket].key
        .split('-')
        .map(keyValue => parseContinuousBucketValue(keyValue)));
    const currentRanges = binData.map(bin => bin.keyArray[0]
      .split('-')
      .map(keyValue => parseContinuousBucketValue(keyValue)));

    return isEqual(defaultGroupNames, currentGroupNames) && isEqual(defaultRanges, currentRanges);
  };

  const resetBinsDisabled = variable.plotTypes === 'categorical'
    ? Object.keys(variable.bins)
      .filter(bin => variable.bins[bin].key !== variable.bins[bin].groupName)
      .length === 0
    : checkIfContinuousBinsAreDefault();

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
          {humanify({ term: fieldName })}
        </h2>
        <Row>
          {plots.concat('delete')
            .map(plotType => (
              <Tooltip Component={vizButtons[plotType].title} key={plotType}>
                <Button
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
                    ...(plotType === variable.active_chart
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
                      )
                      }
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
                      )
                      }
                      style={{ marginRight: 5 }}
                      type="radio"
                      value="number"
                    />
                    # of Cases
                  </label>
                  <DownloadVisualizationButton
                    data={chartData.map(d => ({
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
                      selector: `#${wrapperId}-container .test-bar-chart svg`,
                      title: humanify({ term: fieldName }),
                    })
                    }
                    tooltipHTML="Download image or data"
                  />
                </form>
                {/* {variable.active_chart === 'survival' && (
                <div>
                  <form>
                    {' '}
                    <label
                      htmlFor={`overall-survival-${fieldName}`}
                      style={{ marginRight: 5, fontSize: '1.2rem' }}
                    >
                      <input
                        id={`overall-survival-${fieldName}`}
                        type={'radio'}
                        value={'overall'}
                        aria-label={`Overall survival for ${fieldName}`}
                        onChange={() =>
                          dispatch(
                            updateClinicalAnalysisVariable({
                              fieldName,
                              variableKey: 'active_survival',
                              value: 'overall',
                              id,
                            })
                          )}
                        checked={variable.active_survival === 'overall'}
                        style={{ marginRight: 5 }}
                      />
                      Overall Survival
                    </label>
                    <label
                      htmlFor={`progression-survival-${fieldName}`}
                      style={{ fontSize: '1.2rem', marginLeft: 10 }}
                    >
                      <input
                        id={`progression-survival-${fieldName}`}
                        type={'radio'}
                        value={'progression'}
                        aria-label={`Progression free survival for ${fieldName}`}
                        onChange={() =>
                          dispatch(
                            updateClinicalAnalysisVariable({
                              fieldName,
                              variableKey: 'active_survival',
                              value: 'progression',
                              id,
                            })
                          )}
                        checked={variable.active_survival === 'progression'}
                        style={{ marginRight: 5 }}
                      />
                      Progression Free Survival
                    </label>
                  </form>
                  <span style={{ fontSize: '1rem', marginLeft: 10 }}>
                    Log Rank Test P=Value ={' '}
                  </span>
                </div>
              )} */}
              </Row>
            )}

            {variable.active_chart === 'histogram' && (
              <BarChart
                data={chartData}
                height={CHART_HEIGHT}
                styles={{
                  bars: { fill: theme.secondary },
                  tooltips: {
                    fill: '#fff',
                    stroke: theme.greyScale4,
                    textFill: theme.greyScale3,
                  },
                  xAxis: {
                    textFill: theme.greyScaleD3,
                  },
                  yAxis: {
                    stroke: theme.greyScale4,
                    textFill: theme.greyScale3,
                  },
                }}
                xAxis={{
                  style: styles.histogram(theme).axis,
                }}
                yAxis={{
                  style: styles.histogram(theme).axis,
                  title: `${
                    variable.active_calculation === 'number' ? '#' : '%'
                    } of Cases`,
                }}
              />
            )}
            {variable.active_chart === 'survival' && (
              <div
                style={{
                  display: 'flex',
                  flex: '0 0 auto',
                  flexDirection: 'column',
                  height: '265px',
                  justifyContent: 'center',
                  margin: '5px 2px 10px',
                }}
              >
                {selectedSurvivalValues.length === 0 ? (
                  <SurvivalPlotWrapper
                    {...overallSurvivalData}
                    height={202}
                    plotType="clinicalOverall"
                    survivalPlotLoading={survivalPlotLoading}
                    uniqueClass="clinical-survival-plot"
                  />
                ) : (
                    <SurvivalPlotWrapper
                      {...selectedSurvivalData}
                      height={202}
                      plotType="categorical"
                      survivalPlotLoading={survivalPlotLoading}
                      uniqueClass="clinical-survival-plot"
                    />
                  )}
              </div>
            )}
            {variable.active_chart === 'box' && (
              <Column
                style={{
                  alignItems: 'space-between',
                  height: CHART_HEIGHT,
                  justifyContent: 'center',
                  marginBottom: 10,
                  minWidth: 300,
                }}
              >
                <Row style={{ width: '100%' }}>
                  <Row style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginLeft: 10,
                    width: BOX_PLOT_RATIO,
                  }}
                  >
                    <span style={{
                      color: theme.greyScale3,
                      fontSize: '1.2rem',
                    }}
                    >
                      Box Plot
                    </span>
                  </Row>
                  <Row>
                    <DownloadVisualizationButton
                      buttonStyle={{
                        fontSize: '1.2rem',
                        lineHeight: 0,
                        minHeight: 20,
                        minWidth: 22,
                        padding: 0,
                      }}
                      noText
                      slug={`boxplot-${fieldName}`}
                      svg={() => wrapSvg({
                        className: 'boxplot',
                        selector: `#${wrapperId}-boxplot-container figure svg`,
                        title: `${humanify({ term: fieldName })} Box Plot`,
                      })
                      }
                      tooltipHTML="Download SVG or PNG"
                    />
                  </Row>
                  <Row style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 10,
                    width: QQ_PLOT_RATIO,
                  }}
                  >
                    <span style={{
                      color: theme.greyScale3,
                      fontSize: '1.2rem',
                    }}
                    >
                      QQ Plot
                    </span>
                  </Row>
                  <Row>
                    <DownloadVisualizationButton
                      buttonStyle={{
                        fontSize: '1.2rem',
                        lineHeight: 0,
                        minHeight: 20,
                        minWidth: 22,
                        padding: 0,
                      }}
                      data={qqData}
                      noText
                      slug={`qq-plot-${fieldName}`}
                      svg={() => wrapSvg({
                        className: 'qq-plot',
                        selector: `#${wrapperId}-qqplot-container .qq-plot svg`,
                        title: `${humanify({ term: fieldName })} QQ Plot`,
                      })}
                      tooltipHTML="Download plot data"
                      tsvData={qqData}
                    />
                  </Row>
                </Row>
                <Row
                  style={{
                    height: CHART_HEIGHT,
                    justifyContent: 'space-between',
                  }}
                >
                  <Column
                    id={`${wrapperId}-boxplot-container`}
                    style={{
                      height: CHART_HEIGHT + 10,
                      maxHeight: CHART_HEIGHT + 10,
                      minWidth: '150px',
                      width: '150px',
                    }}
                  >
                    <TooltipInjector>
                      <BoxPlotWrapper data={dataValues} />
                    </TooltipInjector>
                  </Column>
                  <Column
                    id={`${wrapperId}-qqplot-container`}
                    style={{
                      height: CHART_HEIGHT + 10,
                      maxHeight: CHART_HEIGHT + 10,
                      width: QQ_PLOT_RATIO,
                    }}
                  >
                    <QQPlotQuery
                      chartHeight={CHART_HEIGHT + 10}
                      dataBuckets={dataBuckets}
                      dataHandler={data => setQQData(data)}
                      fieldName={fieldName}
                      filters={cardFilters}
                      first={totalDocs}
                      setDataHandler={() => setQQDataIsSet()}
                      setId={setId}
                      wrapperId={wrapperId}
                    />
                  </Column>
                </Row>
              </Column>
            )}
          </Column>
        )}
      {!isEmpty(tableData) && (
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
                  Select action
                </Button>
              )}
              dropdownStyle={{
                left: 0,
                minWidth: 205,
              }}
            >
              {[
                ...(variable.active_chart !== 'box' ? [
                  <DropdownItem
                    key="save-set"
                    style={{
                      ...styles.actionMenuItem,
                      ...setActionsDisabled ? styles.actionMenuItemDisabled(theme) : {},
                    }
                    }
                  >
                    <Row
                      onClick={() => {
                        if (setActionsDisabled) {
                          return;
                        }
                        dispatch(
                          setModal(
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
                          )
                        );
                      }}
                    >
                      Save as new case set
                    </Row>
                  </DropdownItem>,
                  <DropdownItem
                    key="append-set"
                    style={{
                      ...styles.actionMenuItem,
                      ...setActionsDisabled ? styles.actionMenuItemDisabled(theme) : {},
                    }
                    }
                  >
                    <Row
                      onClick={() => {
                        if (setActionsDisabled) {
                          return;
                        }
                        dispatch(
                          setModal(
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
                          )
                        );
                      }}
                    >
                      Add to existing case set
                    </Row>
                  </DropdownItem>,
                  <DropdownItem
                    key="remove-set"
                    style={{
                      ...styles.actionMenuItem,
                      ...setActionsDisabled ? styles.actionMenuItemDisabled(theme) : {},
                    }
                    }
                  >
                    <Row
                      onClick={() => {
                        if (setActionsDisabled) { return; }
                        dispatch(
                          setModal(
                            <RemoveSetModal
                              field="cases.case_id"
                              filters={cardFilters}
                              RemoveFromSetButton={RemoveFromExploreCaseSetButton}
                              selected={Object.keys(get(currentAnalysis, 'sets.case', {}))[0] || ''}
                              title={`Remove ${totalFromSelectedBuckets} Cases from Existing Set`}
                              type="case"
                            />
                          )
                        );
                      }}
                    >
                      Remove from existing case set
                    </Row>
                  </DropdownItem>,
                ] : []),
                <DropdownItem
                  key="tsv"
                  onClick={() => downloadToTSV({
                    filename: `analysis-${
                      currentAnalysis.name
                      }-${tsvSubstring}.${timestamp()}.tsv`,
                    selector: `#analysis-${tsvSubstring}-table`,
                  })
                  }
                  style={{
                    ...styles.actionMenuItem,
                    borderTop: variable.active_chart !== 'box' ? `1px solid ${theme.greyScale5}` : '',
                  }}
                >
                  Export TSV
                </DropdownItem>,
              ]}
            </Dropdown>
            {
              variable.active_chart !== 'box' && (
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
                    onClick={() => dispatch(
                      setModal(
                        variable.plotTypes === 'continuous'
                          ? (
                            <ContinuousCustomBinsModal
                              bins={bucketsOrganizedByKey}
                              defaultData={defaultData}
                              fieldName={humanify({ term: fieldName })}
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
                              }
                              }
                            />
                          )
                          : (
                            <GroupValuesModal
                              bins={variable.bins}
                              dataBuckets={dataBuckets}
                              fieldName={humanify({ term: fieldName })}
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
                              }
                              }
                            />
                          ),
                      ),
                    )
                    }
                    style={styles.actionMenuItem}
                  >
                    Edit Bins
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      dispatch(
                        updateClinicalAnalysisVariable({
                          fieldName,
                          id,
                          value: variable.plotTypes === 'continuous'
                            ? defaultData.buckets
                            : dataBuckets.reduce((acc, r) => ({
                              ...acc,
                              [r.key]: {
                                ...r,
                                groupName: r.key,
                              },
                            }), {}),
                          variableKey: 'bins',
                        }),
                      );
                    }}
                    style={{
                      ...styles.actionMenuItem,
                      ...(resetBinsDisabled ? styles.actionMenuItemDisabled(theme) : {}),
                    }}
                  >
                    Reset to Default
                  </DropdownItem>
                </Dropdown>
              )
            }
          </Row>
          <EntityPageHorizontalTable
            data={tableData.map(tableRow => ({
              ...tableRow,
              // the key in the table needs to be the display name
              key: tableRow.groupName !== undefined ? tableRow.groupName : tableRow.key,
            }))}
            headings={getHeadings(variable.active_chart, dataDimension, fieldName)}
            tableContainerStyle={{
              height: 175,
            }}
            tableId={`analysis-${tsvSubstring}-table`}
          />
        </Column >
      )}
    </Column >
  );
};

export default compose(
  setDisplayName('EnhancedClinicalVariableCard'),
  connect((state: any) => ({ analysis: state.analysis })),
  withTheme,
  withState('selectedSurvivalData', 'setSelectedSurvivalData', {}),
  withState('selectedSurvivalValues', 'setSelectedSurvivalValues', []),
  withState('selectedSurvivalLoadingIds', 'setSelectedSurvivalLoadingIds', []),
  withState('survivalPlotLoading', 'setSurvivalPlotLoading', true),
  withState('selectedBuckets', 'setSelectedBuckets', []),
  withState('qqData', 'setQQData', []),
  withState('qqDataIsSet', 'setQQDataIsSet', false),
  withPropsOnChange(
    (props, nextProps) => !isEqual(props.data, nextProps.data),
    ({ data, fieldName, variable }) => {
      const sanitisedId = fieldName.split('.').pop();
      const rawQueryData = get(data, `explore.cases.aggregations.${fieldName.replace('.', '__')}`, data);
      const dataDimension = dataDimensions[sanitisedId] && dataDimensions[sanitisedId].unit;
      return Object.assign(
        {
          dataBuckets: get(rawQueryData, variable.plotTypes === 'continuous' ? 'range.buckets' : 'buckets', []),
          dataValues: variable.plotTypes === 'continuous' && map(
            {
              ...rawQueryData.stats,
              ...rawQueryData.percentiles,
            },
            (value, stat) => {
              switch (dataDimension) {
                case 'Year': {
                  return ({
                    [stat]: Number.parseFloat(value / DAYS_IN_YEAR).toFixed(0),
                  });
                }
                default:
                  return ({
                    [stat]: value,
                  });
              }
            }
          ).reduce((acc, item) => ({
            ...acc,
            ...item,
          }), {}),
          totalDocs: get(data, 'hits.total', 0),
          wrapperId: `${sanitisedId}-chart`,
        },
        dataDimensions[sanitisedId] && {
          axisTitle: dataDimensions[sanitisedId].axisTitle,
          dataDimension: dataDimensions[sanitisedId].unit,
          dataValues:
            map(
              {
                ...rawQueryData.stats,
                ...rawQueryData.percentiles,
              },
              (value, stat) => {
                switch (dataDimensions[sanitisedId].unit) {
                  case 'Years': {
                    return ({
                      [stat]: Number.parseFloat(value / DAYS_IN_YEAR).toFixed(0),
                    });
                  }
                  default:
                    return ({
                      [stat]: value,
                    });
                }
              }
            ).reduce((acc, item) => ({
              ...acc,
              ...item,
            }), {}),
        },
      );
    }
  ),
  withPropsOnChange(
    (props, nextProps) => !isEqual(props.dataBuckets, nextProps.dataBuckets) || props.setId !== nextProps.setId,
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
          value: variable.plotTypes === 'continuous' ? (Object.keys(variable.bins).reduce((acc, curr, index) => ({
            ...acc,
            [curr]: {
              ...variable.bins[curr],
              doc_count: dataBuckets[index].doc_count,
            },
          }), {})
          ) : ({
            ...reduce(variable.bins, (acc, bin, key) => {
              if (bin.groupName && bin.groupName !== key) {
                return {
                  ...acc,
                  [key]: {
                    doc_count: 0,
                    groupName: bin.groupName,
                    key,
                  },
                };
              }
              return acc;
            }, {}),
            ...dataBuckets.reduce((acc, r) => ({
              ...acc,
              [r.key]: {
                ...r,
                groupName:
                  typeof get(variable, `bins.${r.key}.groupName`, undefined) === 'string' // hidden value have groupName '', so check if it is string
                    ? get(variable, `bins.${r.key}.groupName`, undefined)
                    : r.key,
              },
            }), {}),
          }),
          variableKey: 'bins',
        }),
      );
    }
  ),
  withProps(
    ({
      dataBuckets,
      fieldName,
      setId,
      totalDocs,
      variable,
    }) => ({
      binData: map(groupBy(variable.bins, bin => bin.groupName), (values, key) => ({
        doc_count: values.reduce((acc, value) => acc + value.doc_count, 0),
        key,
        keyArray: values.reduce((acc, value) => [...acc, value.key], []),
      })).filter(bin => bin.key),
      bucketsOrganizedByKey: dataBuckets.reduce((acc, r) => {
        return ({
          ...acc,
          [r.key]: {
            ...r,
            groupName: r.groupName !== undefined && r.groupName !== '' ? r.groupName : r.key,
          },
        });
      }, {}),
      getContinuousBuckets: (acc, { doc_count, key, keyArray }) => {
        const keyValues = key.split('-').map(keyItem => Number(keyItem));
        // survival doesn't have keyArray
        const keyArrayValues = keyArray ? keyArray[0].split('-').map(keyItem => Number(keyItem)) : keyValues;

        const groupName = keyValues.length === 2 &&
          typeof keyValues[0] === 'number' &&
          typeof keyValues[1] === 'number'
          ? getContinuousRangeValue(keyValues)
          : key;
        const keyMin = keyArrayValues[0];
        const keyMax = keyArrayValues[1];
        const filters =
          variable.plotTypes === 'continuous'
            ? {
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
                  op: '<=',
                  content: {
                    field: fieldName,
                    value: [keyMax],
                  },
                },
              ],
            } : {};

        return [
          ...acc,
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
          },
        ];
      },
    })
  ),
  withProps(({ data, fieldName, variable }) => {
    if (variable.plotTypes === 'categorical') {
      return ({ defaultData: {} });
    }
    const dataStats = data.explore.cases.aggregations[`${fieldName.replace('.', '__')}`].stats;

    const defaultMin = dataStats.Min;
    const defaultMax = dataStats.Max;

    const defaultQuartile = Number(((defaultMax - defaultMin) / 4).toFixed(2));
    const defaultBuckets = Array(4).fill(1).map((val, key) => {
      const from = Math.floor(key * defaultQuartile + defaultMin);
      const to = Math.floor((key + 1) === 4
        ? defaultMax
        : (defaultMin + (key + 1) * defaultQuartile - 1));
      const objKey = `${from}-${to}`;

      return ({
        [objKey]: {
          groupName: `${from.toFixed(1)}-${to.toFixed(1)}`,
          key: objKey,
        },
      });
    }).reduce((acc, curr) => ({
      ...acc,
      ...curr,
    }), {});

    return ({
      defaultData: {
        buckets: defaultBuckets,
        max: defaultMax,
        min: defaultMin,
        quartile: defaultQuartile,
      },
    });
  }),
  withProps(
    ({
      binData,
      dataBuckets,
      fieldName,
      filters,
      getContinuousBuckets,
      selectedSurvivalValues,
      setSelectedSurvivalData,
      setSelectedSurvivalLoadingIds,
      setSelectedSurvivalValues,
      setSurvivalPlotLoading,
      variable,
    }) => ({
      populateSurvivalData: () => {
        setSurvivalPlotLoading(true);
        const dataForSurvival =
          variable.plotTypes === 'continuous'
            ? dataBuckets
              .sort((a, b) => b.key.split('-')[0] - a.key.split('-')[0])
              .reduce(getContinuousBuckets, [])
            : binData
              .filter(bucket => (IS_CDAVE_DEV ? bucket.key : bucket.key !== '_missing'))
              .map(b => ({
                ...b,
                chart_doc_count: b.doc_count,
              }));

        const filteredData = dataForSurvival
          .filter(x => x.chart_doc_count >= MINIMUM_CASES)
          .filter(x => x.key !== '_missing');

        const continuousTop2Values =
          variable.plotTypes === 'continuous'
            ? filteredData
              .sort((a, b) => b.chart_doc_count - a.chart_doc_count)
              .slice(0, 2)
            : [];

        const valuesForTable =
          variable.plotTypes === 'categorical'
            ? filteredData.map(d => d.key).slice(0, 2)
            : continuousTop2Values.map(d => d.key);

        const valuesForPlot =
          variable.plotTypes === 'categorical'
            ? [...filteredData.map(d => d.keyArray).slice(0, 2)]
            : continuousTop2Values;

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

        const valuesForPlot =
          variable.plotTypes === 'categorical'
            ? [...nextValues]
            : nextValues
              .map(v => data.filter(d => d.key === v)[0])
              .map(filteredData => ({
                ...filteredData,
                doc_count: undefined,
              }));

        getSurvivalCurvesArray({
          currentFilters: filters,
          field: fieldName,
          plotType: variable.plotTypes,
          values: valuesForPlot,
        }).then(receivedData => {
          setSelectedSurvivalData(receivedData);
          setSurvivalPlotLoading(false);
          setSelectedSurvivalLoadingIds([]);
        });
      },
    })
  ),
  withPropsOnChange(
    (props, nextProps) => props.variable.active_chart !== nextProps.variable.active_chart ||
      !isEqual(props.data, nextProps.data) ||
      !isEqual(props.variable.bins, nextProps.variable.bins),
    ({ populateSurvivalData, variable }) => {
      if (variable.active_chart === 'survival') {
        populateSurvivalData();
      }
    }
  ),
  withPropsOnChange(['id'], ({ setSelectedBuckets }) => setSelectedBuckets([])),
  lifecycle({
    componentDidMount(): void {
      const {
        bucketsOrganizedByKey,
        dispatch,
        fieldName,
        id,
        variable,
        wrapperId,
      } = this.props;
      if (Object.keys(variable.bins).length === 0) {
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
)(ClinicalVariableCard);
