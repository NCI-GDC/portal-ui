// @flow
import React, { Component } from 'react';

import DevSettingsButton from './DevSettingsButton';

// this component is for creating buttons so we can toggle things
// during the UI development process.
// it should not be used in user-facing work.

export default class DevControls extends Component {
  state = { showDevSettings: false };

  toggleDevSettings() {
    const { showDevSettings } = this.state;
    this.setState({ showDevSettings: !showDevSettings });
  }

  render() {
    const {
      buttons,
      message = '',
      openButtonStyle = {
        position: 'absolute',
        right: 0,
        top: -45,
      },
    } = this.props;

    const { showDevSettings } = this.state;

    return showDevSettings
      ? (
        <div
          style={{
            background: '#eee',
            border: '1px solid #ccc',
            borderRadius: 10,
            marginBottom: 20,
            padding: '20px 20px 15px',
          }}
          >
          <h2 style={{ marginTop: 0 }}>
            Dev Settings
            {' '}
            <DevSettingsButton
              buttonClickHandler={() => this.toggleDevSettings()}
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
            buttonClickHandler={() => this.toggleDevSettings()}
            style={openButtonStyle}
            >
            dev
          </DevSettingsButton>
        </p>
    );
  }
}
