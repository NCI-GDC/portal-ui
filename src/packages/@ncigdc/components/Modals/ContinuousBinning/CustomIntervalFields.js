import React from 'react';
import BinningInput from './BinningInput';
import BinningMethodInput from './BinningMethodInput';

const styles = {
  inputWrapper: { maxWidth: '100px' },
  text: {
    lineHeight: '34px',
    padding: '0 10px',
  },
};

const CustomIntervalFields = ({
  disabled,
  handleChange,
  handleUpdateBinningMethod,
  intervalErrors,
  intervalFields,
  validateIntervalFields,
}) => {
  const CustomIntervalText = props => {
    const { children } = props;
    return (
      <div style={styles.text}>
        {children}
      </div>
    );
  };

  return (
    <div
      className="binning-interval"
      onMouseDown={() => {
        if (disabled) {
          handleUpdateBinningMethod();
        }
      }}
      role="presentation"
      style={{
        display: 'flex',
        marginBottom: '15px',
      }}
      >
      <div>
        <BinningMethodInput
          binningMethod="interval"
          checked={!disabled}
          handleChange={handleUpdateBinningMethod}
          label="Bin Interval"
          />
      </div>
      <div style={styles.inputWrapper}>
        <BinningInput
          binningMethod="interval"
          disabled={disabled}
          errorVisible={!disabled}
          handleBlur={validateIntervalFields}
          handleChange={handleChange}
          inputError={intervalErrors.amount}
          inputId="custom-interval-amount"
          inputKey="amount"
          valid={intervalErrors.amount === ''}
          value={intervalFields.amount}
          />
      </div>
      <CustomIntervalText>limit values from</CustomIntervalText>
      <div style={styles.inputWrapper}>
        <BinningInput
          binningMethod="interval"
          disabled={disabled}
          errorVisible={!disabled}
          handleBlur={validateIntervalFields}
          handleChange={handleChange}
          inputError={intervalErrors.min}
          inputId="custom-interval-min"
          inputKey="min"
          valid={intervalErrors.min === ''}
          value={intervalFields.min}
          />
      </div>
      <CustomIntervalText>to</CustomIntervalText>
      <div style={styles.inputWrapper}>
        <BinningInput
          binningMethod="interval"
          disabled={disabled}
          errorVisible={!disabled}
          handleBlur={validateIntervalFields}
          handleChange={handleChange}
          inputError={intervalErrors.max}
          inputId="custom-interval-max"
          inputKey="max"
          valid={intervalErrors.max === ''}
          value={intervalFields.max}
          />
      </div>
    </div>
  );
};

export default CustomIntervalFields;
