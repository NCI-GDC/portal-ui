import React from 'react';

import SurvivalPlotWrapper from '@ncigdc/components/SurvivalPlotWrapper';

import '../../survivalPlot.css';
import { OVERALL_SURVIVAL_SLUG } from '../../helpers';

const ClinicalSurvivalPlot = ({
  plotType,
  survivalData: { id, legend, rawData },
  survivalPlotLoading,
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
      plotType={plotType}
      rawData={rawData}
      slug={OVERALL_SURVIVAL_SLUG}
      survivalPlotLoading={survivalPlotLoading}
      uniqueClass={OVERALL_SURVIVAL_SLUG}
      />
  </div>
);

export default ClinicalSurvivalPlot;
