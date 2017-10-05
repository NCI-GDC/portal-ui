import React from 'react';
import { withProps, compose, branch, renderComponent } from 'recompose';
import { Tooltip } from '../../uikit/Tooltip/index';

export default compose(
  withProps(props => ({ pvalue: props.analysis.pvalue })),
  branch(
    props => props.children,
    renderComponent(({ pvalue, children, ...props }) =>
      children({ pvalue, ...props }),
    ),
  ),
)(({ pvalue = 0 }) => (
  <Tooltip
    Component={
      pvalue === 0 && (
        <div>
          Value shows 0.00e+0 because the<br />P-Value is extremely low and goes
          beyond<br />the precision inherent in the code
        </div>
      )
    }
  >
    P-Value {pvalue === 0 ? '≈' : '='} {pvalue.toExponential(2)}
  </Tooltip>
));
