import React from 'react';

import SurvivalPlotWrapper from '@ncigdc/components/SurvivalPlotWrapper';

import '../../survivalPlot.css';

const ClinicalSurvivalPlot = ({
  downloadChartName,
  palette,
  plotType,
  survivalData: { id, legend, rawData },
  survivalDataLoading,
}) => (
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
    <SurvivalPlotWrapper
      height={202}
      id={id}
      legend={legend}
      palette={palette}
      plotType={plotType}
      rawData={rawData}
      slug={`${downloadChartName}-survival-plot`}
      survivalDataLoading={survivalDataLoading}
      />
  </div>
);

export default ClinicalSurvivalPlot;
