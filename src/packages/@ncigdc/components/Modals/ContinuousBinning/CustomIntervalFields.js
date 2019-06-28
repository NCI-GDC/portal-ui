import React from 'react';
import BinningMethodInput from './BinningMethodInput';
import CustomIntervalInput from './CustomIntervalInput';
import styles from './styles';

const fields = [
  {
    label: '',
    name: 'amount',
  },
  {
    label: 'limit values from',
    name: 'min',
  },
  {
    label: 'to',
    name: 'max',
  },
];

const CustomIntervalFields = ({
  disabled,
  handleChange,
  handleUpdateBinningMethod,
  inputStyles,
  intervalErrors,
  intervalFields,
  validateIntervalFields,
}) => {
  return (
    <div
      className="binning-interval"
      onMouseDown={() => {
        disabled && handleUpdateBinningMethod();
      }}
      role="presentation"
      style={styles.intervalWrapper}
      >
      <div>
        <BinningMethodInput
          binningMethod="interval"
          checked={!disabled}
          handleChange={handleUpdateBinningMethod}
          label="Bin Interval"
          />
      </div>
      {fields.map(field => (
        <CustomIntervalInput
          disabled={disabled}
          error={intervalErrors[field.name]}
          handleBlur={validateIntervalFields}
          handleChange={handleChange}
          inputStyles={inputStyles}
          key={`custom-interval-${field.name}`}
          label={field.label}
          name={field.name}
          value={intervalFields[field.name]}
          />
      ))}
    </div>
  );
};

export default CustomIntervalFields;
