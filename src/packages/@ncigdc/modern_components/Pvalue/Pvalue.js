import React from 'react';

export default props => (
  <div>
    P-Value {props.analysis.pvalue === 0 ? '≈' : '='}{' '}
    {props.analysis.pvalue.toExponential(2)}
  </div>
);
