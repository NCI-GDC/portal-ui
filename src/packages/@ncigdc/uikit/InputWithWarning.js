// @flow
import React from 'react';
import { compose, withState } from 'recompose';
import WarningBox from '@ncigdc/uikit/WarningBox';

export default compose(
  withState('value', 'setValue', ({ value = '' }) => value),
)(
  ({
    labelText,
    handleOnChange,
    value,
    setValue,
    maxLength,
    showWarning,
    warningMessage,
    style,
  }) => (
    <div style={style}>
      <label style={{ marginTop: 10 }}>
        {labelText}
        <br />
        <input
          style={{ width: '100%' }}
          autoFocus
          onFocus={e => e.target.select()}
          value={value}
          onChange={e => {
            setValue(e.target.value);
            handleOnChange(e);
          }}
          id="save-set-modal-name"
          type="text"
        />
        {value.length > maxLength && (
          <WarningBox>Maximum name length is {maxLength}</WarningBox>
        )}
      </label>
      {showWarning && <WarningBox>{warningMessage}</WarningBox>}
    </div>
  ),
);
