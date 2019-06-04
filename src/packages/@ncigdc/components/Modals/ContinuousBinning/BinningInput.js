import React from 'react';

const styles = {
  error: {
    color: 'red',
  },
  inputDisabled: {
    background: '#efefef',
  },
  inputHorizontal: {
    margin: '0',
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
  inputErrors,
  inputId,
  valid,
  validateOnBlur,
  value,
}) => {
  return (
    <React.Fragment>
      <input
        disabled={disabled}
        id={inputId}
        onBlur={validateOnBlur}
        onChange={handleChange}
        style={{
          ...(binningMethod === 'interval' ? styles.inputHorizontal : styles.inputTable),
          ...(disabled ? styles.inputDisabled : {}),
          ...(valid ? {} : styles.inputInvalid),
        }}
        type="text"
        value={value}
        />
      {inputErrors.map(err => <div key={`${inputId}-error-${err.substr(0, 2)}`} style={styles.error}>{err}</div>)}
    </React.Fragment>
  );
};

export default BinningInput;
