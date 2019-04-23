import React from 'react';
import { compose, withState, withPropsOnChange, withProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';

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

const ClinicalVariableSurvivalPlot: React.ComponentType<IVariableSurvivalPlotProps> = ({ }) => {
	return (
		<div style={wrapperStyles}>Hello World!</div>
	);
};

export default enhance(ClinicalVariableSurvivalPlot);