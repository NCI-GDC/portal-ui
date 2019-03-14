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
import Hidden from '@ncigdc/components/Hidden';
import tryParseJSON from '@ncigdc/utils/tryParseJSON';
import BarChart from '@ncigdc/components/Charts/BarChart';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import { makeFilter } from '@ncigdc/utils/filters';

// survival plot
import { getDefaultCurve, enoughData } from '@ncigdc/utils/survivalplot';
import SurvivalPlotWrapper from '@ncigdc/components/SurvivalPlotWrapper';
import { getSurvivalCurves } from '@ncigdc/utils/survivalplot';
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
import { IS_CDAVE_DEV } from '@ncigdc/utils/constants';

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
};

const enhance = compose(
  connect((state: any) => ({ analysis: state.analysis })),
  withTheme,
  withPropsOnChange(['viewer'], ({ viewer }) => ({
    parsedFacets:
      viewer && viewer.explore.cases.facets
        ? tryParseJSON(viewer.explore.cases.facets, {})
        : {},
    continuousAggs: viewer && viewer.explore.cases.aggregations,
  })),
  withState('selectedSurvivalData', 'setSelectedSurvivalData', {}),
  withState('overallSurvivalData', 'setOverallSurvivalData', {}),
  withState('selectedSurvivalLoadingId', 'setSelectedSurvivalLoadingId', ''),
  withState('survivalPlotLoading', 'setSurvivalPlotLoading', true),
  withState(
    'hasEnoughOverallSurvivalData',
    'setHasEnoughOverallSurvivalData',
    false
  ),
  withProps(
    ({
      selectedSurvivalData,
      setSelectedSurvivalData,
      overallSurvivalData,
      setOverallSurvivalData,
      hasEnoughOverallSurvivalData,
      setHasEnoughOverallSurvivalData,
      setSurvivalPlotLoading,
      filters,
      fieldName,
      setState,
    }) => ({
      survivalData: {
        legend: selectedSurvivalData.legend || overallSurvivalData.legend,
        rawData: selectedSurvivalData.rawData || overallSurvivalData.rawData,
      },
      populateSurvivalData: async () => {
        setSurvivalPlotLoading(true);
        const nextSurvivalData = await getDefaultCurve({
          currentFilters: filters,
          slug: `Clinical Analysis - ${fieldName}`,
        });

        setOverallSurvivalData(nextSurvivalData);
        setHasEnoughOverallSurvivalData(nextSurvivalData.rawData);
        setSelectedSurvivalData({});

        setSurvivalPlotLoading(false);
      },
    })
  ),
  withPropsOnChange(['filters'], ({ filters, populateSurvivalData }) => {
    populateSurvivalData();
  })
);

const ClinicalVariableCard: React.ComponentType<IVariableCardProps> = ({
  variable,
  fieldName,
  plots,
  style = {},
  theme,
  dispatch,
  id,
  parsedFacets,
  continuousAggs,
  setId,
  survivalData,
  hasEnoughOverallSurvivalData,
  survivalPlotLoading,
  selectedSurvivalData,
  setSelectedSurvivalData,
  setSelectedSurvivalLoadingId,
  selectedSurvivalLoadingId,
  filters,
}) => {
  const rawQueryData =
    variable.plotTypes === 'continuous'
      ? (
          continuousAggs[fieldName.replace('.', '__')].histogram || {
            buckets: [],
          }
        ).buckets
      : (_.values(parsedFacets)[0] || { buckets: [] }).buckets;

  const totalDocsFromBuckets = rawQueryData
    .map(b => b.doc_count)
    .reduce((acc, i) => acc + i, 0);

  const getCategoricalTableData = (rawData, type) => {
    if (_.isEmpty(rawData)) {
      return [];
    }

    const getCountLink = ({ doc_count, filters }) => {
      return (
        <span>
          <ExploreLink
            query={{
              searchTableTab: 'cases',
              filters,
            }}
          >
            {(doc_count || 0).toLocaleString()}
          </ExploreLink>
          <span>{` (${(((doc_count || 0) / totalDocsFromBuckets) * 100).toFixed(
            2
          )}%)`}</span>
        </span>
      );
    };

    const getBucketRangesAndFilters = (acc, { doc_count, key }) => {
      const valueIsDays = str => /(days_to|age_at)/.test(str);
      const valueIsYear = str => /year_of/.test(str);

      const getRangeValue = (key, field) => {
        if (valueIsDays(field)) {
          return `${getLowerAgeYears(key)}${
            acc.nextInterval === 0
              ? '+'
              : ' - ' + getUpperAgeYears(acc.nextInterval - 1)
          } years`;
        } else if (valueIsYear(field)) {
          return `${Math.floor(key)}${
            acc.nextInterval === 0
              ? ' - present'
              : ' - ' + (acc.nextInterval - 1)
          }`;
        } else {
          return key;
        }
      };
      return {
        nextInterval: key,
        data: [
          ...acc.data,
          {
            chart_doc_count: doc_count,
            doc_count: getCountLink({
              doc_count,
              filters: {
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
                      field: `cases.${fieldName}`,
                      value: [
                        `${valueIsYear(fieldName) ? Math.floor(key) : key}`,
                      ],
                    },
                  },
                  ...(acc.nextInterval !== 0 && [
                    {
                      op: '<=',
                      content: {
                        field: `cases.${fieldName}`,
                        value: [`${acc.nextInterval - 1}`],
                      },
                    },
                  ]),
                ],
              },
            }),
            key: getRangeValue(key, fieldName),
          },
        ],
      };
    };

    let displayData =
      type === 'continuous'
        ? rawData
            .sort((a, b) => b.key - a.key)
            .reduce(getBucketRangesAndFilters, { nextInterval: 0, data: [] })
            .data.slice(0)
            .reverse()
        : rawData
            .filter(bucket =>
              !IS_CDAVE_DEV ? bucket.key !== '_missing' : bucket.key
            )
            .map(b => ({
              ...b,
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
          // id={id}
          type="checkbox"
          // value={setId}
          // disabled={msg}
          onChange={e => console.log(e.target.value)}
          checked={false}
        />
      ),
      ...(variable.active_chart === 'survival'
        ? {
            survival: (
              <Tooltip
                Component={
                  hasEnoughOverallSurvivalData
                    ? `Click icon to plot ${b.key}`
                    : 'Not enough survival data'
                }
              >
                <Button
                  style={{
                    padding: '2px 3px',
                    backgroundColor: hasEnoughOverallSurvivalData
                      ? colors(b.key === selectedSurvivalData.id ? '1' : '0')
                      : '#666',
                    color: 'white',
                    margin: '0 auto',
                    position: 'static',
                  }}
                  disabled={!hasEnoughOverallSurvivalData}
                  onClick={() => {
                    if (b.key !== selectedSurvivalData.id) {
                      setSelectedSurvivalLoadingId(b.key);
                      getSurvivalCurves({
                        field: fieldName,
                        value: b.key,
                        currentFilters: filters,
                        slug: `${b.key}`,
                      }).then(data => {
                        setSelectedSurvivalData(data);
                        setSelectedSurvivalLoadingId('');
                      });
                    } else {
                      setSelectedSurvivalData({});
                    }
                  }}
                >
                  {b.key === selectedSurvivalLoadingId ? (
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

  const devData = [
    ...tableData,
    { select: '', key: 'Total', doc_count: totalDocsFromBuckets, survival: '' },
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
                : (d.chart_doc_count / totalDocsFromBuckets) * 100,
            tooltip: `${d.key}: ${d.chart_doc_count.toLocaleString()}`,
          };
        })
      : [];

  return (
    <Column
      style={{
        ...zDepth1,
        height: 560,
        margin: '0 1rem 1rem',
        padding: '0.5rem 1rem 1rem',
        ...style,
      }}
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
                flex: '0 0 auto',
                height: CHART_HEIGHT - 10,
                margin: '5px 5px 10px',
              }}
            >
              <SurvivalPlotWrapper
                {...survivalData}
                height={180}
                onReset={() => setSelectedSurvivalData({})}
                customClass="categorical-survival-plot"
                survivalPlotLoading={survivalPlotLoading}
              />
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
                  style={{ ...visualizingButton, padding: '0 12px' }}
                  rightIcon={<DownCaretIcon />}
                >
                  Select action
                </Button>
              }
            />
            <Button style={{ padding: '0 12px' }} rightIcon={<DownCaretIcon />}>
              Customize Bins
            </Button>
          </Row>
          <EntityPageHorizontalTable
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
