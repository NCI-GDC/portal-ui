// @flow
import React from 'react';

import withTooltip from './withTooltip';

type TProps = {
  Component: any,
  children: any,
  setTooltip: Function,
};

const Tooltip = ({ Component, children, setTooltip, ...props }: TProps) => (
  <span
    onMouseOver={() =>
      setTimeout(() => setTooltip(Component), props.interval || 0)}
    onMouseOut={() => setTooltip()}
    {...props}
  >
    {children}
  </span>
);

export default withTooltip(Tooltip);
