import React from 'react';
import { withProps, compose, branch, renderComponent } from 'recompose';

export default compose(
  withProps(props => ({ pvalue: props.analysis.pvalue })),
  branch(
    props => props.children,
    renderComponent(({ pvalue, children, ...props }) =>
      children({ pvalue, ...props }),
    ),
  ),
)(({ pvalue = 0 }) => (
  <div>
    P-Value {pvalue === 0 ? '≈' : '='} {pvalue.toExponential(2)}
  </div>
));
