import React from 'react';
import styles from './styles';

const {
  input: {
    inputDisabled, inputError, inputHorizontal, inputInvalid, inputText, inputWrapper100px,
  },
} = styles;

const CustomIntervalInput = ({
  disabled,
  error,
  handleBlur,
  handleChange,
  label,
  name,
  value,
}) => {
  return (
    <React.Fragment>
      {label !== '' && (
        <div style={inputText}>
          {label}
        </div>
      )}
      <div style={inputWrapper100px}>
        <input
          disabled={disabled}
          id={`custom-interval-${name}`}
          onBlur={handleBlur}
          onChange={handleChange}
          style={{
            ...inputHorizontal,
            ...(disabled ? inputDisabled : {}),
            ...(error !== '' && !disabled ? inputInvalid : {}),
          }}
          type="text"
          value={value}
        />
        {error !== '' && !disabled && <div style={inputError}>{error}</div>}
      </div>
    </React.Fragment>
  );
};

export default CustomIntervalInput;
