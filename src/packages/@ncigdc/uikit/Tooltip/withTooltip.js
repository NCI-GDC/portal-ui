// @flow
import React from 'react';
import {
  compose,
  lifecycle,
  mapProps,
  setDisplayName,
  withHandlers,
  withState,
} from 'recompose';
import { connect } from 'react-redux';
import { omit } from 'lodash';
import { setTooltip } from './dux';

const enhance = compose(
  setDisplayName('TooltipEnhancer'),
  connect(),
  withState('tooltipState', 'setTooltipState', false),
  withHandlers({
    setTooltip: ({ dispatch, setTooltipState }) => (tooltip = null) => {
      setTooltipState(tooltip);
      dispatch(setTooltip(tooltip));
    },
  }),
  lifecycle({
    componentWillUnmount(): void {
      if (this.props.tooltipState) {
        this.props.setTooltip();
      }
    },
  }),
  mapProps(props => omit(props, [
    'tooltipState',
    'setTooltipState',
    'dispatch',
  ]),),
);

const withTooltip = Wrapped => enhance(props => <Wrapped {...props} />);

export const TooltipInjector = enhance(({
  children,
  ...props
}) => React.cloneElement(
  children, props
));

export default withTooltip;
