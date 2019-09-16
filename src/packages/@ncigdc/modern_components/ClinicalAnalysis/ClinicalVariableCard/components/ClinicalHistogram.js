import React from 'react';
import BarChart from '@ncigdc/components/Charts/BarChart';
import { analysisColors } from '@ncigdc/utils/constants';
import { theme } from '@ncigdc/theme';
import { CHART_HEIGHT } from '../helpers';

const ClinicalHistogram = ({
  active_calculation,
  histogramData,
  histogramStyles,
  theme,
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
          style: histogramStyles(theme).axis,
        }}
        yAxis={{
          style: histogramStyles(theme).axis,
          title: `${
            active_calculation === 'number' ? '#' : '%'
          } of Cases`,
        }}
        />
      {showXAxisLabels ||
        <div
          className="no-print"
          style={{ 
            color: theme.greyScale3, 
            fontSize: '1.2rem',
            marginBottom: 20, 
            marginTop: -40,
            textAlign: 'center',
          }}
          >
          Roll over the graph to see X axis labels
        </div> 
      }
    </React.Fragment>
  )
};

export default ClinicalHistogram;
