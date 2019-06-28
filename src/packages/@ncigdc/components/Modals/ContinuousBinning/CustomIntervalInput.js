import React from 'react';
import styles from './styles';

const {
  input: {
    inputDisabled,
    inputError,
    inputHorizontal,
    inputInvalid,
    inputText,
    inputWrapper100px,
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
      {label.length > 0 && (
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
            ...(error.length > 0 && !disabled ? inputInvalid : {}),
          }}
          type="text"
          value={value}
          />
        {error.length > 0 && !disabled && <div style={inputError}>{error}</div>}
      </div>
    </React.Fragment>
  );
};

export default CustomIntervalInput;
