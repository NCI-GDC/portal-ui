import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  pure,
  setDisplayName,
} from 'recompose';
import Button from '@ncigdc/uikit/Button';

import './styles.scss';

const ControlledAccessSwitch = ({
  studies = [],
  switchHandler = () => {},
  user,
}) => (
  user && studies.length > 0
  ? (
    <section className="controlled-access-switch">
      <p>
        {'Controlled data from: '}
        <span>
          {studies.join(', ').toUpperCase()}
        </span>
      </p>
      <Button
        onClick={switchHandler}
        style={{
          ':hover': {
            backgroundColor: '#9b43b1',
          },
          backgroundColor: '#773388',
          padding: '0.2rem 1rem',
        }}
        testTag="controlled-access-switch"
        >
        Switch
      </Button>
    </section>
  )
  : null
);

export default compose(
  setDisplayName('EnhancedControlledAccessSwitch'),
  connect(state => ({
    user: state.auth.user,
  })),
  pure,
)(ControlledAccessSwitch);
