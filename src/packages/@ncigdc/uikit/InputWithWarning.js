// @flow
import React from 'react';
import { compose, withState } from 'recompose';
import { noop } from 'lodash';
import WarningBox from '@ncigdc/uikit/WarningBox';

export default compose(
  withState('value', 'setValue', ({ value = '' }) => value),
)(
  ({
    labelText,
    handleOnChange = noop,
    handleOnKeyPress = noop,
    value,
    setValue,
    maxLength,
    showWarning,
    warningMessage,
    style,
  }) => (
    <div style={style}>
      <label style={{
        marginTop: 10,
        width: '100%',
      }}>
        {labelText}
        <br />
        <input
          autoFocus
          id="save-set-modal-name"
          onChange={e => {
            setValue(e.target.value);
            handleOnChange(e);
          }}
          onFocus={e => e.target.select()}
          onKeyPress={handleOnKeyPress}
          style={{ width: '100%' }}
          type="text"
          value={value} />
        {value.length > maxLength && (
          <WarningBox>
Maximum name length is
            {maxLength}
          </WarningBox>
        )}
      </label>
      {showWarning && <WarningBox>{warningMessage}</WarningBox>}
    </div>
  ),
);
