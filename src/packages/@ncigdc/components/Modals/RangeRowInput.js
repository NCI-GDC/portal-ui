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

const RangeRowInput = (
  disabled,
  inputErrors,
  inputKey,
  inputValue,
  onChange,
  rowIndex,
  style,
  valid,
) => {
  const mapKey = `range-row-${rowIndex}-${inputKey}`;
  return (
    <td key={mapKey} style={{ padding: '5px' }}>
      <input
        aria-labelledby={`range-table-label-${inputKey}`}
        disabled={disabled}
        id={mapKey}
        onChange={onChange}
        style={{
          ...styles.inputTable,
          ...(disabled ? {} : styles.inputDisabled),
          ...(valid ? {} : styles.inputInvalid),
        }}
        type={inputKey === 'name' ? 'text' : 'number'}
        value={inputValue}
      />
      {inputErrors.map(err => <span key={`${mapKey}-error-${err.substr(0, 2)}`} style={styles.error}>{err}</span>)}
    </td>
  );
};

export default RangeRowInput;
