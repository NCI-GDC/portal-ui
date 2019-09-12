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
const CHART_HEIGHT = 320;
const CHART_MARGINS = {
  bottom: 90,
  left: 70,
  right: 40,
  top: 20,
};
const HistogramCard = ({
  data,
  mappingLabel,
  mappingValue,
  xAxisTitle,
}) => {
  return (
    <div
      style={{
        height: '100%',
        margin: 'auto',
        width: '95%',
      }}
      >
      <BarChart
        data={data}
        height={CHART_HEIGHT}
        mappingLabel={mappingLabel}
        mappingValue={mappingValue}
        margin={CHART_MARGINS}
        styles={chartStyles}
        xAxis={{
          title: xAxisTitle,
        }}
        yAxis={{
          title: '% of Cases Affected',
        }}
        />
    </div>
  );
};

export default HistogramCard;
