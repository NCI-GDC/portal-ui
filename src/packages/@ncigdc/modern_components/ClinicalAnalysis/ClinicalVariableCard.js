import React from 'react';
import { compose, withState, withPropsOnChange, withProps } from 'recompose';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';
import { connect } from 'react-redux';
import _ from 'lodash';
import { scaleOrdinal, schemeCategory10 } from 'd3';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { zDepth1 } from '@ncigdc/theme/mixins';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import Dropdown from '@ncigdc/uikit/Dropdown';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import Hidden from '@ncigdc/components/Hidden';
import tryParseJSON from '@ncigdc/utils/tryParseJSON';
import BarChart from '@ncigdc/components/Charts/BarChart';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';
import { CreateExploreCaseSetButton } from '@ncigdc/modern_components/withSetAction';
import { AppendExploreCaseSetButton } from '@ncigdc/modern_components/withSetAction';
import { RemoveFromExploreCaseSetButton } from '@ncigdc/modern_components/withSetAction';
import { setModal } from '@ncigdc/dux/modal';
import SaveSetModal from '@ncigdc/components/Modals/SaveSetModal';
import AppendSetModal from '@ncigdc/components/Modals/AppendSetModal';
import RemoveSetModal from '@ncigdc/components/Modals/RemoveSetModal';
import { downloadToTSV } from '@ncigdc/components/DownloadTableToTsvButton';

// survival plot
import {
  getDefaultCurve,
  getSurvivalCurvesArray,
} from '@ncigdc/utils/survivalplot';
import SurvivalPlotWrapper from '@ncigdc/components/SurvivalPlotWrapper';
import { SpinnerIcon } from '@ncigdc/theme/icons';

import {
  CloseIcon,
  SurvivalIcon,
  BarChartIcon,
  BoxPlot,
} from '@ncigdc/theme/icons';
import { withTheme } from '@ncigdc/theme';
import { IThemeProps } from '@ncigdc/theme/versions/active';

import {
  removeClinicalAnalysisVariable,
  updateClinicalAnalysisVariable,
  IAnalysisPayload,
} from '@ncigdc/dux/analysis';
import { humanify } from '@ncigdc/utils/string';
import { getLowerAgeYears, getUpperAgeYears } from '@ncigdc/utils/ageDisplay';
import timestamp from '@ncigdc/utils/timestamp';

import { IS_CDAVE_DEV } from '@ncigdc/utils/constants';
import { MAXIMUM_CURVES, MINIMUM_CASES } from '../../utils/survivalplot';

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
  plotTypes: TPlotType;
  active_chart: TActiveChart;
  active_calculation: TActiveCalculation;
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
const vizButtons: IVizButtons = {
  survival: {
    title: 'Survival Plot',
    icon: <SurvivalIcon style={{ height: '1em' }} />,
    action: updateClinicalAnalysisVariable,
  },
  histogram: {
    title: 'Histogram',
    icon: <BarChartIcon style={{ height: '1em', width: '1em' }} />,
    action: updateClinicalAnalysisVariable,
  },
  box: {
    title: 'Box/QQ Plot',
    icon: <BoxPlot style={{ height: '1em', width: '1em' }} />,
    action: updateClinicalAnalysisVariable,
  },
  delete: {
    title: 'Remove Card',
    icon: <CloseIcon style={{ height: '1em', width: '1em' }} />,
    action: removeClinicalAnalysisVariable,
  },
};

const styles = {
  common: (theme: IThemeProps) => ({
    backgroundColor: 'transparent',
    color: theme.greyScale2,
    border: `1px solid ${theme.greyScale4}`,
    justifyContent: 'flex-start',
    ':hover': {
      backgroundColor: 'rgb(0,138,224)',
      color: '#fff',
      border: `1px solid rgb(0,138,224)`,
    },
  }),
  activeButton: (theme: IThemeProps) => ({
    ...styles.common(theme),
    color: '#fff',
    backgroundColor: theme.primary,
    border: `1px solid ${theme.primary}`,
  }),
  histogram: (theme: IThemeProps) => ({
    axis: {
      textFill: theme.greyScale3,
      fontSize: '0.9rem',
      fontWeight: '500',
      stroke: theme.greyScale4,
    },
  }),
  actionMenuItem: { lineHeight: '1.5', cursor: 'pointer' },
};

const valueIsDays = str => /(days_to|age_at)/.test(str);
const valueIsYear = str => /year_of/.test(str);

const getRangeValue = (key, field, nextInterval) => {
  if (valueIsDays(field)) {
    return `${getLowerAgeYears(key)}${
      nextInterval === 0 ? '+' : ' - ' + getUpperAgeYears(nextInterval - 1)
    } years`;
  } else if (valueIsYear(field)) {
    return `${Math.floor(key)}${
      nextInterval === 0 ? ' - present' : ' - ' + (nextInterval - 1)
    }`;
  } else {
    return key;
  }
};

const getCountLink = ({ doc_count, filters, totalDocs }) => (
  <span>
    <ExploreLink
      query={{
        searchTableTab: 'cases',
        filters,
      }}
    >
      {(doc_count || 0).toLocaleString()}
    </ExploreLink>
    <span>{` (${(((doc_count || 0) / totalDocs) * 100).toFixed(2)}%)`}</span>
  </span>
);

const enhance = compose(
  connect((state: any) => ({ analysis: state.analysis })),
  withTheme,
  withState('selectedSurvivalData', 'setSelectedSurvivalData', {}),
  withState('selectedSurvivalValues', 'setSelectedSurvivalValues', []),
  withState('selectedSurvivalLoadingIds', 'setSelectedSurvivalLoadingIds', []),
  withState('survivalPlotLoading', 'setSurvivalPlotLoading', true),
  withProps(({ variable, data, fieldName }) => ({
    rawQueryData:
      variable.plotTypes === 'continuous'
        ? (
            (data.explore &&
              data.explore.cases.aggregations[fieldName.replace('.', '__')]
                .histogram) || {
              buckets: [],
            }
          ).buckets
        : (data || { buckets: [] }).buckets,
    totalDocs: (data.hits || { total: 0 }).total,
  })),
  withProps(
    ({ rawQueryData, variable, fieldName, setId, data, totalDocs }) => ({
      getBucketRangesAndFilters: (acc, { doc_count, key }) => {
        const filters =
          variable.plotTypes === 'categorical'
            ? {}
            : {
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
                      value: [
                        `${valueIsYear(fieldName) ? Math.floor(key) : key}`,
                      ],
                    },
                  },
                  ...(acc.nextInterval !== 0 && [
                    {
                      op: '<=',
                      content: {
                        field: fieldName,
                        value: [`${acc.nextInterval - 1}`],
                      },
                    },
                  ]),
                ],
              };

        return {
          nextInterval: key,
          data: [
            ...acc.data,
            {
              chart_doc_count: doc_count,
              doc_count: getCountLink({
                doc_count,
                filters,
                totalDocs,
              }),
              key: getRangeValue(key, fieldName, acc.nextInterval),
              rangeValues: { min: key, max: Math.floor(acc.nextInterval - 1) },
            },
          ],
        };
      },
    })
  ),
  withState('selectedBuckets', 'setSelectedBuckets', []),
  withProps(
    ({
      setSurvivalPlotLoading,
      setSelectedSurvivalData,
      filters,
      fieldName,
      variable,
      data,
      setId,
      setSelectedSurvivalValues,
      selectedSurvivalValues,
      setSelectedSurvivalLoadingIds,
      rawQueryData,
      getBucketRangesAndFilters,
    }) => ({
      populateSurvivalData: () => {
        setSurvivalPlotLoading(true);

        const dataForSurvival =
          variable.plotTypes === 'continuous'
            ? rawQueryData
                .sort((a, b) => b.key - a.key)
                .reduce(getBucketRangesAndFilters, {
                  nextInterval: 0,
                  data: [],
                })
                .data.slice(0)
                .reverse()
            : rawQueryData
                .filter(bucket =>
                  !IS_CDAVE_DEV ? bucket.key !== '_missing' : bucket.key
                )
                .map(b => ({
                  ...b,
                  chart_doc_count: b.doc_count,
                }));

        const continuousTop2Values =
          variable.plotTypes === 'continuous'
            ? dataForSurvival
                .sort((a, b) => b.chart_doc_count - a.chart_doc_count)
                .slice(0, 2)
            : [];

        const valuesForTable =
          variable.plotTypes === 'categorical'
            ? dataForSurvival.map(d => d.key).slice(0, 2)
            : continuousTop2Values.map(d => d.key);

        const valuesForPlot =
          variable.plotTypes === 'categorical'
            ? [...valuesForTable]
            : continuousTop2Values;

        setSelectedSurvivalValues(valuesForTable);
        setSelectedSurvivalLoadingIds(valuesForTable);

        getSurvivalCurvesArray({
          field: fieldName,
          values: valuesForPlot,
          currentFilters: filters,
          plotType: variable.plotTypes,
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
                .map(data => ({ ...data, doc_count: undefined }));

        getSurvivalCurvesArray({
          field: fieldName,
          values: valuesForPlot,
          currentFilters: filters,
          plotType: variable.plotTypes,
        }).then(data => {
          setSelectedSurvivalData(data);
          setSurvivalPlotLoading(false);
          setSelectedSurvivalLoadingIds([]);
        });
      },
    })
  ),
  withPropsOnChange(
    (props, nextProps) =>
      props.variable.active_chart !== nextProps.variable.active_chart,
    ({ filters, populateSurvivalData, variable }) => {
      if (variable.active_chart === 'survival') {
        populateSurvivalData();
      }
    }
  ),
  withPropsOnChange(['id'], ({ setSelectedBuckets }) => setSelectedBuckets([]))
);

const ClinicalVariableCard: React.ComponentType<IVariableCardProps> = ({
  variable,
  fieldName,
  plots,
  style = {},
  theme,
  dispatch,
  id,
  setId,
  overallSurvivalData,
  survivalPlotLoading,
  setSelectedSurvivalLoadingId,
  selectedSurvivalLoadingIds,
  selectedSurvivalData,
  selectedSurvivalValues,
  updateSelectedSurvivalValues,
  filters,
  stats,
  selectedBuckets,
  setSelectedBuckets,
  rawQueryData,
  getBucketRangesAndFilters,
  totalDocs,
  currentAnalysis,
}) => {
  const getCategoricalTableData = (rawData, type) => {
    if (_.isEmpty(rawData)) {
      return [];
    }

    const displayData =
      type === 'continuous'
        ? rawData
            .sort((a, b) => b.key - a.key)
            .reduce(getBucketRangesAndFilters, {
              nextInterval: 0,
              data: [],
            })
            .data.slice(0)
            .reverse()
        : rawData
            .filter(bucket =>
              !IS_CDAVE_DEV ? bucket.key !== '_missing' : bucket.key
            )
            .map(b => ({
              ...b,
              key: b.key,
              chart_doc_count: b.doc_count,
              doc_count: getCountLink({
                doc_count: b.doc_count,
                filters:
                  b.key === '_missing'
                    ? {
                        op: 'AND',
                        content: [
                          {
                            op: 'IS',
                            content: { field: fieldName, value: [b.key] },
                          },
                          {
                            op: 'in',
                            content: {
                              field: 'cases.case_id',
                              value: `set_id:${setId}`,
                            },
                          },
                        ],
                      }
                    : makeFilter([
                        {
                          field: 'cases.case_id',
                          value: `set_id:${setId}`,
                        },
                        { field: fieldName, value: [b.key] },
                      ]),
                totalDocs,
              }),
            }));

    return displayData.map(b => ({
      ...b,
      select: (
        <input
          style={{
            marginLeft: 3,
            pointerEvents: 'initial',
          }}
          id={b.key}
          type="checkbox"
          value={b.key}
          aria-label={`${fieldName}-${b.key}`}
          disabled={b.doc_count === 0}
          onChange={e => {
            if (_.find(selectedBuckets, { key: b.key })) {
              setSelectedBuckets(
                _.reject(selectedBuckets, r => r.key === b.key)
              );
            } else {
              setSelectedBuckets([...selectedBuckets, b]);
            }
          }}
          checked={!!_.find(selectedBuckets, { key: b.key })}
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
                  style={{
                    padding: '2px 3px',
                    backgroundColor:
                      selectedSurvivalValues.indexOf(b.key) === -1
                        ? '#666'
                        : colors(selectedSurvivalValues.indexOf(b.key)),
                    color: 'white',
                    margin: '0 auto',
                    position: 'static',
                    opacity:
                      b.key === '_missing' ||
                      b.chart_doc_count < MINIMUM_CASES ||
                      (selectedSurvivalValues.length >= MAXIMUM_CURVES &&
                        selectedSurvivalValues.indexOf(b.key) === -1)
                        ? '0.33'
                        : '1',
                  }}
                  disabled={
                    b.key === '_missing' ||
                    b.chart_doc_count < MINIMUM_CASES ||
                    (selectedSurvivalValues.length >= MAXIMUM_CURVES &&
                      selectedSurvivalValues.indexOf(b.key) === -1)
                  }
                  onClick={() => {
                    updateSelectedSurvivalValues(displayData, b);
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

  const getBoxTableData = rawData => {
    if (_.isEmpty(rawData)) {
      return {};
    }
    // TODO: what num format for stat counts?
    return _.map((rawData || { stats: {} }).stats, (count, stat) => {
      return {
        stat,
        count,
      };
    });
  };

  let tableData =
    variable.active_chart === 'box'
      ? getBoxTableData([])
      : getCategoricalTableData(rawQueryData, variable.plotTypes);

  const noDataTotal =
    totalDocs - rawQueryData.reduce((acc, bucket) => acc + bucket.doc_count, 0);

  const devData = [
    ...tableData,
    ...(noDataTotal > 0 && [
      {
        select: '',
        key: 'Not in Index',

        doc_count: (
          <span>
            {(noDataTotal || 0).toLocaleString()}
            {` (${(((noDataTotal || 0) / totalDocs) * 100).toFixed(2)}%)`}
          </span>
        ),
        survival: '',
      },
    ]),
    { select: '', key: 'Total', doc_count: totalDocs, survival: '' },
  ];

  const getHeadings = chartType => {
    return chartType === 'box'
      ? [
          { key: 'stat', title: 'Stat' },
          {
            key: 'count',
            title: 'Value',
            style: { textAlign: 'right' },
          },
        ]
      : [
          {
            key: 'select',
            title: 'Select',
            thStyle: { position: 'sticky', top: 0 },
          },
          {
            key: 'key',
            title: humanify({ term: fieldName }),
            thStyle: { position: 'sticky', top: 0 },
          },
          {
            key: 'doc_count',
            title: '# Cases',
            style: { textAlign: 'right' },
            thStyle: { position: 'sticky', top: 0, textAlign: 'right' },
          },
          ...(chartType === 'survival'
            ? [
                {
                  key: 'survival',
                  title: 'Survival',
                  style: { display: 'flex', justifyContent: 'flex-end' },
                  thStyle: { position: 'sticky', top: 0, textAlign: 'right' },
                },
              ]
            : []),
        ];
  };

  const chartData =
    variable.active_chart === 'histogram'
      ? tableData.map(d => {
          return {
            label: _.truncate(d.key, { length: 18 }),
            value:
              variable.active_calculation === 'number'
                ? d.chart_doc_count
                : (d.chart_doc_count / totalDocs) * 100,
            tooltip: `${d.key}: ${d.chart_doc_count.toLocaleString()}`,
          };
        })
      : [];

  // set action will default to cohort total when no buckets are selected
  const totalFromSelectedBuckets = selectedBuckets.length
    ? selectedBuckets.reduce((acc, b) => acc + b.chart_doc_count, 0)
    : totalDocs;

  const getContinuousSetFilters = () => {
    const bucketRanges = selectedBuckets.map(b => b.rangeValues);

    if (bucketRanges.length === 1 && bucketRanges[0].max === -1) {
      return addInFilters(filters, {
        op: 'and',
        content: [
          {
            op: '>=',
            content: {
              field: fieldName,
              value: [bucketRanges[0].min],
            },
          },
        ],
      });
    }

    return addInFilters(filters, {
      op: 'and',
      content: [
        {
          op: '>=',
          content: {
            field: fieldName,
            value: [_.min(bucketRanges.map(range => range.min))],
          },
        },
        {
          op: '<=',
          content: {
            field: fieldName,
            value: [_.max(bucketRanges.map(range => range.max))],
          },
        },
      ],
    });
  };

  const getCategoricalSetFilters = () => {
    let bucketFilters = filters;
    if (
      selectedBuckets.filter(bucket => bucket.key !== '_missing').length > 0
    ) {
      bucketFilters = addInFilters(bucketFilters, {
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: fieldName,
              value: selectedBuckets
                .filter(bucket => bucket.key !== '_missing')
                .map(selectedBucket => selectedBucket.key),
            },
          },
        ],
      });
    }

    if (_.find(selectedBuckets, bucket => bucket.key === '_missing')) {
      bucketFilters = addInFilters(bucketFilters, {
        op: 'and',
        content: [
          {
            op: 'is',
            content: {
              field: fieldName,
              value: 'MISSING',
            },
          },
        ],
      });
    }
    return bucketFilters;
  };
  let cardFilters = filters;
  if (selectedBuckets.length) {
    cardFilters =
      variable.plotTypes === 'continuous'
        ? getContinuousSetFilters()
        : getCategoricalSetFilters();
  }

  const tsvSubstring = fieldName.replace(/\./g, '-');
  return (
    <Column
      style={{
        ...zDepth1,
        height: 560,
        margin: '0 1rem 1rem',
        padding: '0.5rem 1rem 1rem',
        ...style,
      }}
      className="clinical-analysis-categorical-card"
    >
      <Row
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '5px 0 10px',
        }}
      >
        <h2 style={{ fontSize: '1.8rem', marginTop: 10, marginBottom: 0 }}>
          {humanify({ term: fieldName })}
        </h2>
        <Row>
          {[...plots, 'delete'].map(plotType => {
            return (
              <Tooltip key={plotType} Component={vizButtons[plotType].title}>
                <Button
                  style={{
                    ...(plotType === variable.active_chart
                      ? styles.activeButton(theme)
                      : styles.common(theme)),
                    margin: 2,
                  }}
                  onClick={() => {
                    dispatch(
                      vizButtons[plotType].action({
                        fieldName,
                        variableKey: 'active_chart',
                        value: plotType,
                        id,
                      })
                    );
                  }}
                >
                  <Hidden>{vizButtons[plotType].title}</Hidden>
                  {vizButtons[plotType].icon}
                </Button>
              </Tooltip>
            );
          })}
        </Row>
      </Row>
      {_.isEmpty(tableData) && (
        <Row
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          There is no data for this facet
        </Row>
      )}

      {!_.isEmpty(tableData) && (
        <div>
          <Row style={{ paddingLeft: 10 }}>
            {variable.active_chart !== 'survival' && (
              <form>
                {' '}
                <label
                  htmlFor={`variable-percentage-radio-${fieldName}`}
                  style={{ marginRight: 10, fontSize: '1.2rem' }}
                >
                  <input
                    id={`variable-percentage-radio-${fieldName}`}
                    type={'radio'}
                    value={'percentage'}
                    aria-label={'Percentage of cases'}
                    onChange={() =>
                      dispatch(
                        updateClinicalAnalysisVariable({
                          fieldName,
                          variableKey: 'active_calculation',
                          value: 'percentage',
                          id,
                        })
                      )
                    }
                    checked={variable.active_calculation === 'percentage'}
                    style={{ marginRight: 5 }}
                  />
                  % of Cases
                </label>
                <label
                  htmlFor={`variable-number-radio-${fieldName}`}
                  style={{ fontSize: '1.2rem' }}
                >
                  <input
                    id={`variable-number-radio-${fieldName}`}
                    type={'radio'}
                    value={'number'}
                    aria-label={'Number of cases'}
                    onChange={() =>
                      dispatch(
                        updateClinicalAnalysisVariable({
                          fieldName,
                          variableKey: 'active_calculation',
                          value: 'number',
                          id,
                        })
                      )
                    }
                    checked={variable.active_calculation === 'number'}
                    style={{ marginRight: 5 }}
                  />
                  # of Cases
                </label>
              </form>
            )}

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
          {variable.active_chart === 'histogram' && (
            <BarChart
              data={chartData}
              yAxis={{
                title: `${
                  variable.active_calculation === 'number' ? '#' : '%'
                } of Cases`,
                style: styles.histogram(theme).axis,
              }}
              xAxis={{
                style: styles.histogram(theme).axis,
              }}
              height={CHART_HEIGHT}
              styles={{
                xAxis: {
                  stroke: theme.greyScale4,
                  textFill: theme.greyScale3,
                },
                yAxis: {
                  stroke: theme.greyScale4,
                  textFill: theme.greyScale3,
                },
                bars: { fill: theme.secondary },
                tooltips: {
                  fill: '#fff',
                  stroke: theme.greyScale4,
                  textFill: theme.greyScale3,
                },
              }}
            />
          )}
          {variable.active_chart === 'survival' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: '0 0 auto',
                height: '265px',
                margin: '5px 5px 10px',
              }}
            >
              {selectedSurvivalValues.length === 0 ? (
                <SurvivalPlotWrapper
                  {...overallSurvivalData}
                  height={202}
                  plotType="clinicalOverall"
                  unqiueClass="clinical-survival-plot"
                  survivalPlotLoading={survivalPlotLoading}
                />
              ) : (
                <SurvivalPlotWrapper
                  {...selectedSurvivalData}
                  height={202}
                  plotType="categorical"
                  unqiueClass="clinical-survival-plot"
                  survivalPlotLoading={survivalPlotLoading}
                />
              )}
            </div>
          )}
          {variable.active_chart === 'box' && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: CHART_HEIGHT - 10,
                backgroundColor: theme.greyScale5,
                margin: '5px 5px 10px',
              }}
            >
              {variable.active_chart}
            </div>
          )}
          <Row style={{ justifyContent: 'space-between', margin: '5px 0' }}>
            <Dropdown
              button={
                <Button
                  style={{
                    ...visualizingButton,
                    padding: '0 12px',
                  }}
                  rightIcon={<DownCaretIcon />}
                >
                  Select action
                </Button>
              }
              dropdownStyle={{ left: 0, minWidth: 205 }}
            >
              <DropdownItem
                style={styles.actionMenuItem}
                onClick={() =>
                  downloadToTSV({
                    selector: `#analysis-${tsvSubstring}-table`,
                    filename: `analysis-${
                      currentAnalysis.name
                    }-${tsvSubstring}.${timestamp()}.tsv`,
                  })
                }
              >
                Export to TSV
              </DropdownItem>
              <DropdownItem
                style={styles.actionMenuItem}
                onClick={() => {
                  dispatch(
                    setModal(
                      <SaveSetModal
                        title={`Save ${totalFromSelectedBuckets} Cases as New Set`}
                        total={totalFromSelectedBuckets}
                        filters={cardFilters}
                        score={'gene.gene_id'}
                        sort={null}
                        type={'case'}
                        displayType={'case'}
                        CreateSetButton={CreateExploreCaseSetButton}
                        setName={'Custom Case Selection'}
                      />
                    )
                  );
                }}
              >
                Save as new case set
              </DropdownItem>
              <DropdownItem
                style={styles.actionMenuItem}
                onClick={() => {
                  dispatch(
                    setModal(
                      <AppendSetModal
                        field="cases.case_id"
                        title={`Add ${totalFromSelectedBuckets} Cases to Existing Set`}
                        total={totalFromSelectedBuckets}
                        filters={cardFilters}
                        score={'gene.gene_id'}
                        sort={null}
                        type={'case'}
                        displayType={'case'}
                        AppendSetButton={AppendExploreCaseSetButton}
                        scope={'explore'}
                      />
                    )
                  );
                }}
              >
                Add to existing case set
              </DropdownItem>
              <DropdownItem
                style={styles.actionMenuItem}
                onClick={() => {
                  dispatch(
                    setModal(
                      <RemoveSetModal
                        field="cases.case_id"
                        title={`Remove ${totalFromSelectedBuckets} Cases from Existing Set`}
                        filters={cardFilters}
                        type={'case'}
                        RemoveFromSetButton={RemoveFromExploreCaseSetButton}
                      />
                    )
                  );
                }}
              >
                Remove from existing case set
              </DropdownItem>
            </Dropdown>
            <Button
              style={{ ...visualizingButton, padding: '0 12px' }}
              rightIcon={<DownCaretIcon />}
            >
              Customize Bins
            </Button>
          </Row>
          <EntityPageHorizontalTable
            tableId={`analysis-${tsvSubstring}-table`}
            data={IS_CDAVE_DEV ? devData : tableData}
            headings={getHeadings(variable.active_chart)}
            tableContainerStyle={{
              height: 175,
              overflow: 'scroll',
            }}
          />
        </div>
      )}
    </Column>
  );
};

export default enhance(ClinicalVariableCard);
