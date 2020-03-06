// @flow
import React from 'react';

import DevSettingsButton from './DevSettingsButton';

// this component is for creating buttons so we can toggle things
// during the UI development process.
// it should not be used in user-facing work.

const DevControls = ({
  buttons,
  message = '',
  openButtonStyle = {
    position: 'absolute',
    right: 0,
    top: -45,
  },
  setShowDevSettings,
  showDevSettings,
}) => (showDevSettings
  ? (
    <div
      style={{
        background: '#eee',
        border: '1px solid #ccc',
        borderRadius: 10,
        marginBottom: 20,
        padding: 20,
      }}
      >
      <h2 style={{ marginTop: 0 }}>
        Dev Settings
        {' '}
        <DevSettingsButton
          buttonClickHandler={() => setShowDevSettings(false)}
          >
          Close
        </DevSettingsButton>
      </h2>
      {message && (<p>{message}</p>)}
      {buttons.map(btn => (
        <DevSettingsButton
          active={btn.active}
          buttonClickHandler={btn.onClick}
          key={btn.label}
          >
          {btn.label}
        </DevSettingsButton>
      ))}
    </div>
  )
  : (
    <p>
      <DevSettingsButton
        buttonClickHandler={() => setShowDevSettings(true)}
        style={openButtonStyle}
        >
        dev
      </DevSettingsButton>
    </p>
));

export default DevControls;
