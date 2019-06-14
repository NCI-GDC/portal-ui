import React from 'react';

const BinningMethodInput = ({
  binningMethod, checked, handleChange, label, validateOnBlur,
}) => {
  return (
    <React.Fragment>
      <input
        checked={checked}
        id={`binning-method-${binningMethod}`}
        name="binning-method"
        onBlur={() => {
          console.log('blur!!!');
          validateOnBlur();
        }}
        onChange={handleChange}
        style={{ marginRight: '15px' }}
        type="radio"
        value={binningMethod}
        />
      <label htmlFor={`binning-method-${binningMethod}`} style={{ lineHeight: '32px' }}>
        {label}
        :&nbsp;
      </label>
    </React.Fragment>
  );
};

export default BinningMethodInput;
