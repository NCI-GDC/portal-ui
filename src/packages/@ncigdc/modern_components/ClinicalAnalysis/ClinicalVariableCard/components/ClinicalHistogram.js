import React from 'react';
import BarChart from '@ncigdc/components/Charts/BarChart';
import { analysisColors } from '@ncigdc/utils/constants';
import { theme } from '@ncigdc/theme';
import { CHART_HEIGHT } from '../helpers';

const ClinicalHistogram = ({
  active_calculation,
  histogramData,
  histogramStyles,
  type,
}) => {
  const showXAxisLabels = histogramData.length <= 20;
  return (
    <React.Fragment>
      <BarChart
        data={histogramData}
        height={CHART_HEIGHT}
        margin={{
          bottom: 50,
          left: 55,
          right: 50,
          top: 20,
        }}
        showXAxisLabels={showXAxisLabels}
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
            fontSize: '1.2rem',
          },
          title: 'Roll over the graph to see X axis labels',
          titleForSVG: 'For the list of histogram values, download the separate TSV file',
        }}
        yAxis={{
          style: histogramStyles(theme).axis,
          title: `${
            active_calculation === 'number' ? '#' : '%'
          } of Cases`,
        }}
        />
    </React.Fragment>
  );
};

export default ClinicalHistogram;
