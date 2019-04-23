import React from 'react';
import { compose, withState, withPropsOnChange, withProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import './survivalPlot.css';
import SurvivalPlotWrapper from '@ncigdc/components/SurvivalPlotWrapper';

const wrapperStyles = {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	flex: '0 0 auto',
	height: '265px',
	margin: '5px 2px 10px',
};

const enhance = compose(
	connect((state: any) => ({ analysis: state.analysis })),
);

const ClinicalVariableSurvivalPlot: React.ComponentType<IVariableSurvivalPlotProps> = ({ selectedSurvivalValues, overallSurvivalData, survivalPlotLoading, selectedSurvivalData, height }) => {
	return (
		<div style={wrapperStyles}>
			{selectedSurvivalValues.length === 0 ? (
				<SurvivalPlotWrapper
					{...overallSurvivalData}
					height={height}
					plotType="clinicalOverall"
					uniqueClass="clinical-survival-plot"
					survivalPlotLoading={survivalPlotLoading}
				/>
			) : (
					<SurvivalPlotWrapper
						{...selectedSurvivalData}
						height={height}
						plotType="categorical"
						uniqueClass="clinical-survival-plot"
						survivalPlotLoading={survivalPlotLoading}
					/>
				)}
		</div>
	);
};

export default enhance(ClinicalVariableSurvivalPlot);