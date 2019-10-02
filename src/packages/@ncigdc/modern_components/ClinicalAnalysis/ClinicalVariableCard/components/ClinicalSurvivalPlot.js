import React from 'react';

import SurvivalPlotWrapper from '@ncigdc/components/SurvivalPlotWrapper';

import '../../survivalPlot.css';

const ClinicalSurvivalPlot = ({
  plotType,
  survivalData: { id, legend, rawData },
  survivalPlotLoading,
}) => {
  const survivalPlotSlug = id && `${id.split('.')[1]}-survival-plot`;
  return (
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
        plotType={plotType}
        rawData={rawData}
        slug={survivalPlotSlug}
        survivalPlotLoading={survivalPlotLoading}
        uniqueClass={survivalPlotSlug}
        />
    </div>
  )
};

export default ClinicalSurvivalPlot;
