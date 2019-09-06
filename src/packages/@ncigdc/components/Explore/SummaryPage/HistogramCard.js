import React from 'react';
import BarChart from '@ncigdc/components/Charts/BarChart';

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
const CHART_HEIGHT = 345;
const CHART_MARGINS = {
  bottom: 100,
  left: 60,
  right: 60,
  top: 20,
};
const HistogramCard = ({ data, xAxisTitle }) => {
  return (
    <BarChart
      data={data}
      height={CHART_HEIGHT}
      margin={CHART_MARGINS}
      styles={chartStyles}
      xAxis={{
        title: xAxisTitle,
      }}
      yAxis={{
        title: '% of Cases Affected',
      }}
      />
  );
};

export default HistogramCard;
