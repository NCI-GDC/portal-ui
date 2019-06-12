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
  validateCustomInterval,
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
      onClick={() => {
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
          validateOnBlur={validateCustomInterval}
          />
      </div>
      <div style={styles.inputWrapper}>
        <BinningInput
          binningMethod="interval"
          disabled={disabled}
          handleChange={handleChange}
          inputError={intervalErrors.amount}
          inputId="custom-interval-amount"
          inputKey="amount"
          valid={intervalErrors.amount === ''}
          validateOnBlur={validateCustomInterval}
          value={intervalFields.amount}
          />
      </div>
      <CustomIntervalText>limit values from</CustomIntervalText>
      <div style={styles.inputWrapper}>
        <BinningInput
          binningMethod="interval"
          disabled={disabled}
          handleChange={handleChange}
          inputError={intervalErrors.min}
          inputId="custom-interval-min"
          inputKey="min"
          valid={intervalErrors.min === ''}
          validateOnBlur={validateCustomInterval}
          value={intervalFields.min}
          />
      </div>
      <CustomIntervalText>to</CustomIntervalText>
      <div style={styles.inputWrapper}>
        <BinningInput
          binningMethod="interval"
          disabled={disabled}
          handleChange={handleChange}
          inputError={intervalErrors.max}
          inputId="custom-interval-max"
          inputKey="max"
          valid={intervalErrors.max === ''}
          validateOnBlur={validateCustomInterval}
          value={intervalFields.max}
          />
      </div>
    </div>
  );
};

export default CustomIntervalFields;
