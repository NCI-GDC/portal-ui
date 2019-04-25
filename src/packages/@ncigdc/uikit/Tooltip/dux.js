// @flow

import { handleActions } from 'redux-actions';

const SET_TOOLTIP = 'gdc/SET_TOOLTIP';

export const setTooltip = Component => ({ type: SET_TOOLTIP, Component });

export default handleActions(
  {
    [SET_TOOLTIP]: (state, { Component }) => ({ Component }),
  },
  { Component: null },
);
