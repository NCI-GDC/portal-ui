import React from 'react';
import { compose, withPropsOnChange, withProps } from 'recompose';
import DownCaretIcon from 'react-icons/lib/fa/caret-down';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { zDepth1 } from '@ncigdc/theme/mixins';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import Dropdown from '@ncigdc/uikit/Dropdown';
import Hidden from '@ncigdc/components/Hidden';
import tryParseJSON from '@ncigdc/utils/tryParseJSON';

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
import { CLINICAL_PREFIXES } from '@ncigdc/utils/constants';

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
};

const enhance = compose(
  connect((state: any) => ({ analysis: state.analysis })),
  withTheme,
  withPropsOnChange(['viewer'], ({ viewer }) => ({
    parsedFacets:
      viewer && viewer.explore.cases.facets
        ? tryParseJSON(viewer.explore.cases.facets, {})
        : {},
  }))
);

const VariableCard: React.ComponentType<IVariableCardProps> = ({
  variable,
  fieldName,
  plots,
  style = {},
  theme,
  dispatch,
  id,
  parsedFacets,
}) => {
  console.log('buckets?', _.values(parsedFacets)[0].buckets);
  console.log('stats? ', _.values(parsedFacets)[0].stats);
  const getCategoricalData = rawData => {
    if (!rawData) {
      return [];
    }
    return (rawData || { buckets: [] }).buckets
      .filter(bucket => bucket.key !== '_missing')
      .map(b => ({
        ...b,
        select: (
          <input
            style={{
              marginLeft: 3,
              pointerEvents: 'initial',
              // pointerEvents: msg ? 'none' : 'initial',
            }}
            // id={id}
            type="checkbox"
            // value={setId}
            // disabled={msg}
            onChange={e => console.log(e.target.value)}
            checked={false}
          />
        ),
      }));
  };

  const getContinuousData = rawData => {
    if (!rawData) {
      return {};
    }
    return _.map((rawData || { stats: {} }).stats, (count, stat) => {
      return { stat, count, style: { textAlign: 'right' } };
    });
  };

  let data =
    variable.plotTypes === 'continuous'
      ? getContinuousData(_.values(parsedFacets)[0])
      : getCategoricalData(_.values(parsedFacets)[0]);
  console.log('data:', data);
  // ([
  //   aggregation.buckets &&
  //     aggregation.buckets.filter(bucket => bucket.key !== '_missing')
  //       .length === 0,
  //   aggregation.count === 0,
  //   aggregation.count === null,
  //   aggregation.stats && aggregation.stats.count === 0,
  // ])
  // [
  //   {
  //     key: 'submitted',
  //     title: 'Submitted Gene Identifier',
  //     subheadings: submittedHeaders,
  //     thStyle: { textAlign: 'center' },
  //   },
  //   {
  //     key: 'mapped',
  //     title: 'Mapped To',
  //     subheadings: [
  //       'GDC Gene ID',
  //       GENE_ID_FIELD_DISPLAY.symbol,
  //     ],
  //     thStyle: { textAlign: 'center' },
  //   },
  // ]

  const getHeadings = type => {
    console.log('type: ', type);
    return type === 'continuous'
      ? [
          { key: 'stat', title: 'Stat' },
          { key: 'count', title: 'Count', thStyle: { textAlign: 'right' } },
        ]
      : [
          { key: 'select', title: 'Select' },
          { key: 'key', title: humanify({ term: fieldName }) },
          { key: 'doc_count', title: '#Cases' },
          { key: 'survival', title: 'Survival' },
        ];
  };

  return (
    <Column
      style={{
        ...zDepth1,
        minHeight: 500,
        margin: '0 1rem 1rem',
        padding: '0.5rem 1rem 1rem',
        ...style,
      }}
    >
      <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.8rem' }}>
          {humanify({
            term: fieldName.replace(
              `${CLINICAL_PREFIXES[_.capitalize(variable.type)]}.`,
              ''
            ),
          })}
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
      {data.length === 0 && <div>There is no data for this facet</div>}

      {data.length > 0 && (
        <div>
          <Row>
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
          </Row>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 180,
              backgroundColor: theme.greyScale5,
              margin: '5px 5px 10px',
            }}
          >
            {variable.active_chart}
          </div>
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
            data={data}
            headings={getHeadings(variable.plotTypes)}
            // tableStyle={{ height: 200, overflow: 'scroll' }}
          />
        </div>
      )}
    </Column>
  );
};

export default enhance(VariableCard);
