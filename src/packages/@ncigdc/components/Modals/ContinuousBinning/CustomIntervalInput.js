import React from 'react';
import styles from './styles';

const { inputStyles } = styles;

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
        <div style={inputStyles.text}>
          {label}
        </div>
      )}
      <div style={inputStyles.inputWrapper}>
        <input
          disabled={disabled}
          id={`custom-interval-${name}`}
          onBlur={handleBlur}
          onChange={handleChange}
          style={{
            ...inputStyles.inputHorizontal,
            ...(disabled ? inputStyles.inputDisabled : {}),
            ...(error !== '' && !disabled ? inputStyles.inputInvalid : {}),
          }}
          type="text"
          value={value}
        />
        {error && !disabled && <div style={inputStyles.error}>{error}</div>}
      </div>
    </React.Fragment>
  );
};

export default CustomIntervalInput;
