import React from 'react';
import styles from './styles';

const {
  column, input: {
    inputDisabled, inputError, inputInTable, inputInvalid,
  },
} = styles;

const RangeInput = ({
  disabled,
  error,
  errorVisible,
  handleChange,
  id,
  value,
}) => {
  return (
    <div
      style={column}
    >
      <input
        readonly={disabled}
        id={id}
        onChange={handleChange}
        style={{
          ...inputInTable,
          ...(disabled ? inputDisabled : {}),
          ...(error !== '' && errorVisible ? inputInvalid : {}),
        }}
        type="text"
        value={value}
      />
      {error !== '' && errorVisible && <div style={inputError}>{error}</div>}
    </div>
  );
};

export default RangeInput;
