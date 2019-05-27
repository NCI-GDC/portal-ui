import React from 'react';

const BinningMethodInput = ({
  binningMethod, defaultChecked, label, onClick,
}) => {
  return (
    <React.Fragment>
      <input
        defaultChecked={defaultChecked}
        id={`binning-method-${binningMethod}`}
        name="binning-method"
        onClick={onClick}
        style={{ marginRight: '15px' }}
        type="radio"
        value={binningMethod}
        />
      <label htmlFor={`binning-method-${binningMethod}`}>
        {label}
        :
      </label>
    </React.Fragment>
  );
};

export default BinningMethodInput;
