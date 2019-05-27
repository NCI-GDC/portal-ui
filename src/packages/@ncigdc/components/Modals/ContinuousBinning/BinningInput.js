import React from 'react';

const styles = {
  error: {
    color: 'red',
  },
  inputDisabled: {
    background: '#efefef',
  },
  inputHorizontal: {
    margin: '0 10px',
    padding: '5px',
    width: '100px',
  },
  inputInvalid: {
    border: '2px solid red',
  },
  inputTable: {
    padding: '5px',
    width: '100%',
  },
};

const BinningInput = ({
  binningMethod,
  disabled,
  handleChange,
  // inputErrors,
  inputId,
  inputKey,
  inputValue,
  valid,
}) => {
  return (
    <React.Fragment>
      <input
        disabled={disabled}
        id={inputId}
        onChange={handleChange}
        style={{
          ...(binningMethod === 'interval' ? styles.inputHorizontal : styles.inputTable),
          ...(disabled ? styles.inputDisabled : {}),
          ...(valid ? {} : styles.inputInvalid),
        }}
        type={inputKey === 'name' ? 'text' : 'number'}
        value={inputValue}
        />
      {/* {inputErrors.map(err => <span key={`${inputId}-error-${err.substr(0, 2)}`} style={styles.error}>{err}</span>)} */}
    </React.Fragment>
  );
};

export default BinningInput;
