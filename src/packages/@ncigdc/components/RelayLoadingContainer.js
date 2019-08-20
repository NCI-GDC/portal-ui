// @flow
import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  setDisplayName,
} from 'recompose';
import Overlay from '@ncigdc/uikit/Overlay';
import Particle from '@ncigdc/uikit/Loaders/Particle';

const RelayLoadingContainer = ({ relayLoading }) => (
  <Overlay className="test-loading-container" show={relayLoading}>
    <Particle />
  </Overlay>
);

export default compose(
  setDisplayName('EnhancedRelayLoadingContainer'),
  connect(state => ({ relayLoading: state.relayLoading })),
)(RelayLoadingContainer);
