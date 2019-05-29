import React from 'react';
import BinningInput from './BinningInput';
import BinningMethodInput from './BinningMethodInput';

const CustomIntervalFields = ({
  customInterval,
  disabled,
  handleChange,
  handleUpdateBinningMethod,
}) => {
  const CustomIntervalInput = props => {
    const { field } = props;
    return (
      <div>
        <BinningInput
          binningMethod="interval"
          disabled={disabled}
          handleChange={handleChange}
          inputErrors={customInterval[field].errors}
          inputId={`custom-interval-${field}`}
          inputKey={field}
          valid={customInterval[field].errors.length === 0}
          value={customInterval[field].value}
          />
      </div>
    );
  };

  const CustomIntervalText = props => {
    const { text } = props;
    return (
      <div style={{
        lineHeight: '26px',
        padding: '0 10px',
      }}
           >
        {text}
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
      <CustomIntervalInput field="amount" />
      <CustomIntervalText>limit values from</CustomIntervalText>
      <CustomIntervalInput field="min" />
      <CustomIntervalText>to</CustomIntervalText>
      <CustomIntervalInput field="max" />
    </div>
  );
};

export default CustomIntervalFields;
