// @flow
import React from 'react';
import {
  compose,
  withState,
  lifecycle,
  withHandlers,
  mapProps,
} from 'recompose';
import { connect } from 'react-redux';
import { setTooltip } from '@ncigdc/uikit/Tooltip';
import { omit } from 'lodash';

const enhance = compose(
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
  mapProps(props =>
    omit(props, ['tooltipState', 'setTooltipState', 'dispatch']),
  ),
);

const withTooltip = Wrapped => enhance(props => <Wrapped {...props} />);

export default withTooltip;
