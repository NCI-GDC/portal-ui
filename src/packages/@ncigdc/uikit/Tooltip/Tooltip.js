// @flow
import React from 'react';

import withTooltip from './withTooltip';

type TProps = {|
  Component: any,
  children: any,
  setTooltip: Function,
|};

type TWrapped = Class<React$Component<*, *, *>> | string;

export const tooltip = (Wrapped: TWrapped) =>
  withTooltip(({ Component, children, setTooltip, ...props }: TProps) =>
    <Wrapped
      onMouseOver={() => setTooltip(Component)}
      onMouseOut={() => setTooltip()}
      {...props}
    />,
  );

export default tooltip('span');
