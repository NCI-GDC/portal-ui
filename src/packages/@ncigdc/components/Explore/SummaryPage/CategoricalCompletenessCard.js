import React from 'react';
import FilteredStackedBarChart from '@ncigdc/components/Charts/FilteredStackedBarChart';
import { Row } from '@ncigdc/uikit/Flex';
import { compose, withState } from 'recompose';
import { withTheme } from '@ncigdc/theme';
import withFacetData from '@ncigdc/modern_components/IntrospectiveType/Introspective.relay';

const chartStyles = {
  bars: { fill: 'rgb(23, 132, 172)' },
  tooltips: {
    fill: '#fff',
    stroke: 'rgb(144, 144, 144)',
    textFill: 'rgb(144,144,144)',
  },
  xAxis: {
    stroke: 'rgb(200, 200, 200)',
    textFill: 'rgb(107, 98, 98)',
  },
  yAxis: {
    stroke: 'rgb(200, 200, 200)',
    textFill: 'rgb(144,144,144)',
  },
};
const CHART_HEIGHT = 250;
const CHART_MARGINS = {
  bottom: 90,
  left: 70,
  right: 40,
  top: 20,
};
const fakeData = [
  {
    symbol: 'Demographics',
    withData: 135,
    total: 260,
  },
  {
    symbol: 'Diagnosis',
    withData: 42,
    total: 260,
  },
  {
    symbol: 'Exposure',
    withData: 130,
    total: 260,
  },
  {
    symbol: 'Family History',
    withData: 100,
    total: 260,
  },
  {
    symbol: 'Treatment',
    withData: 230,
    total: 260,
  },
];
const colors = [
  {
    key: 'withData',
    name: 'With Data',
    color: '#2a9e2c',
  },
  {
    key: 'withoutData',
    name: 'Without Data',
    color: '#cecece',
  },
];
const Legends = () => (
  <Row
    style={{
      display: 'flex',
      justifyContent: 'center',
    }}
    >
    {colors.map(f => (
      <label
        key={f.key}
        style={{
          paddingRight: '10px',
          display: 'inline-block,',
        }}
        >
        <span
          style={{
            color: f.color,
            backgroundColor: f.color,
            textAlign: 'center',
            border: '2px solid',
            height: '18px',
            width: '18px',
            cursor: 'pointer',
            display: 'inline-block',
            marginRight: '6px',
            verticalAlign: 'text-top',
            lineHeight: '16px',
          }}
          />
        {f.name}
      </label>
    ))}
  </Row>
);
const CategoricalCompletenessCard = ({
  bottomMarginForxAxisTitle,
  data,
  setYAxisUnit,
  theme,
  xAxisTitle,
  yAxisUnit,
}) => {
  const isPercent = yAxisUnit === 'percent';
  return (
    <div
      style={{
        height: '100%',
        margin: 'auto',
        width: '95%',
      }}
      >
      <Row
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
        >
        <span style={{ color: theme.primary }}>Cases with Clinical Data Categories Populated</span>
        <form key="y-axis-unit-toggle" name="y-axis-unit-toggle">
          <label
            htmlFor="percentage-cases-radio"
            style={{
              paddingRight: '10px',
              color: theme.greyScale7,
              fontSize: '1.2rem',
            }}
            >
            <input
              checked={yAxisUnit === 'percent'}
              id="percentage-cases-radio"
              onChange={() => setYAxisUnit('percent')}
              style={{ marginRight: '5px' }}
              type="radio"
              value="days"
              />
            % of Cases Affected
          </label>
          <label
            htmlFor="number-cases-radio"
            style={{
              paddingRight: '10px',
              color: theme.greyScale7,
              fontSize: '1.2rem',
            }}
            >
            <input
              checked={yAxisUnit === 'number'}
              id="number-cases-radio"
              onChange={() => setYAxisUnit('number')}
              style={{ marginRight: '5px' }}
              type="radio"
              value="years"
              />
            # of Cases Affected
          </label>
        </form>
        <Legends />
        <div />
      </Row>
      <FilteredStackedBarChart
        colors={colors.reduce(
          (acc, f) => ({
            ...acc,
            [f.key]: f.color,
          }),
          0,
        )}
        data={fakeData.map(el => ({
          ...el,
          withData: el.withData / (isPercent ? (el.total / 100) : 1),
          withoutData: (el.total - el.withData) / (isPercent ? (el.total / 100) : 1),
        }))}
        displayFilters={{
          withData: true,
          withoutData: true,
        }}
        height={CHART_HEIGHT}
        labelX={-9}
        labelY={15}
        margin={CHART_MARGINS}
        styles={chartStyles}
        xAxis={{
          marginTop: bottomMarginForxAxisTitle,
          rotate: 0,
          title: xAxisTitle,
          style: {
            textFill: theme.greyScale3,
            fontSize: '1.3rem',
            fontWeight: '500',
            stroke: theme.greyScale4,
          },

          xAxisTextAnchor: 'middle', // can be start, middle, end
        }}
        xAxisLabelLength={Infinity}
        yAxis={{
          title: isPercent ? '% of Cases ' : '# of Cases',
        }}

        />
    </div>
  );
};

const enhance = compose(
  withState('yAxisUnit', 'setYAxisUnit', 'percent'),
  withTheme,
  withFacetData,
);
export default enhance(CategoricalCompletenessCard);
