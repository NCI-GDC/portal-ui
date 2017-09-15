// @flow
import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import Progress from 'react-progress';
import styled from '@ncigdc/theme/styled';
import { withTheme } from '@ncigdc/theme';

const ProgressBar = styled(Progress, {
  position: 'absolute',
  zIndex: 10000,
});

const ProgressContainer = compose(
  connect(state => ({ percent: state.relayProgress.percent })),
  withTheme,
)(({ percent, theme }) => (
  <ProgressBar
    className="test-progress-bar"
    percent={percent}
    color={theme.primaryLight1}
    height={3}
    speed={2}
    hideDelay={0.1}
  />
));

export default ProgressContainer;
