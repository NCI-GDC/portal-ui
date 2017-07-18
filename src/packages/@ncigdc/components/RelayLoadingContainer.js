// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Overlay from '@ncigdc/uikit/Overlay';
import Particle from '@ncigdc/uikit/Loaders/Particle';

export default compose(
  connect(state => ({ relayLoading: state.relayLoading })),
)(({ relayLoading }) =>
  <Overlay show={relayLoading} data-test="loading-container">
    <Particle />
  </Overlay>,
);
