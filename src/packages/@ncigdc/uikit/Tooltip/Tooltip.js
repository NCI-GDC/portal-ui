// @flow
import React from 'react';

import withTooltip from './withTooltip';

type TProps = {
  Component: any,
  children: any,
  setTooltip: Function,
};

const Tooltip = ({
  Component, children, setTooltip, ...props
}: TProps) => (
  <span
    onMouseOut={() => setTooltip()}
    onMouseOver={() => setTooltip(Component)}
    {...props}>
    {children}
  </span>
);

export default withTooltip(Tooltip);
