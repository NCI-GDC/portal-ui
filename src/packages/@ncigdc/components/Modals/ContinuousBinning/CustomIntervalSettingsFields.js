import React from 'react';
import BinningInput from './BinningInput';
import BinningMethodInput from './BinningMethodInput';

const CustomIntervalSettingsFields = ({
  customIntervalSettings,
  disabled,
  handleChange,
  handleUpdateBinningMethod,
}) => {
  const CustomIntervalSettingsText = props => {
    const { children } = props;
    return (
      <div style={{
        lineHeight: '34px',
        padding: '0 10px',
      }}
           >
        {children}
      </div>
    );
  };

  return (
    <div
      className="binning-interval"
      style={{
        display: 'flex',
        marginBottom: '15px',
      }}
      >
      <div>
        <BinningMethodInput
          binningMethod="interval"
          defaultChecked={!disabled}
          label="Bin Interval"
          onClick={handleUpdateBinningMethod}
          />
      </div>
      <div>
        <BinningInput
          binningMethod="interval"
          disabled={disabled}
          handleChange={handleChange}
          inputErrors={customIntervalSettings.amount.errors}
          inputId="custom-interval-amount"
          inputKey="amount"
          valid={customIntervalSettings.amount.errors.length === 0}
          value={customIntervalSettings.amount.value}
          />
      </div>
      <CustomIntervalSettingsText>limit values from</CustomIntervalSettingsText>
      <div>
        <BinningInput
          binningMethod="interval"
          disabled={disabled}
          handleChange={handleChange}
          inputErrors={customIntervalSettings.min.errors}
          inputId="custom-interval-min"
          inputKey="min"
          valid={customIntervalSettings.min.errors.length === 0}
          value={customIntervalSettings.min.value}
          />
      </div>
      <CustomIntervalSettingsText>to</CustomIntervalSettingsText>
      <div>
        <BinningInput
          binningMethod="interval"
          disabled={disabled}
          handleChange={handleChange}
          inputErrors={customIntervalSettings.max.errors}
          inputId="custom-interval-max"
          inputKey="max"
          valid={customIntervalSettings.max.errors.length === 0}
          value={customIntervalSettings.max.value}
          />
      </div>
    </div>
  );
};

export default CustomIntervalSettingsFields;
