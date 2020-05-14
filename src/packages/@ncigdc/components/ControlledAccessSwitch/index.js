import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  pure,
  setDisplayName,
} from 'recompose';
import Button from '@ncigdc/uikit/Button';
import { Tooltip } from '@ncigdc/uikit/Tooltip';

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
        Controlled data from:
        <span>
          {` ${studies.join(', ').toUpperCase()}`}
        </span>
      </p>
      <Tooltip
        Component={(
          <span>
            Select a different controlled-access dataset
            <br />
            to explore with open-access data
          </span>
        )}
        >
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
      </Tooltip>
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
