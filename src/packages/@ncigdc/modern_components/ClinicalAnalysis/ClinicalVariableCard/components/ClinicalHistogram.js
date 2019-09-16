import React from 'react';
import BarChart from '@ncigdc/components/Charts/BarChart';
import { analysisColors } from '@ncigdc/utils/constants';
import { CHART_HEIGHT } from '../helpers';

const ClinicalHistogram = ({
  active_calculation,
  histogramData,
  histogramStyles,
  theme,
  type,
}) => (
  <BarChart
    data={histogramData}
    height={CHART_HEIGHT}
    margin={{
      bottom: 50,
      left: 55,
      right: 50,
      top: 20,
    }}
    styles={{
      bars: { fill: analysisColors[type] || theme.secondary },
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
      style: {
        ...histogramStyles(theme).axis,
        fontWeight: '700',
      },
    }}
    yAxis={{
      style: histogramStyles(theme).axis,
      title: `${
        active_calculation === 'number' ? '#' : '%'
      } of Cases`,
    }}
    />
);

export default ClinicalHistogram;
