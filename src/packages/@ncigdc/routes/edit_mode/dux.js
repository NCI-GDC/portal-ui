// @flow

import { handleActions } from 'redux-actions';

const SET_DRAGGING_COMPONENT_TYPE = 'gdc/SET_DRAGGING_COMPONENT_TYPE';

export const setDraggingComponent = componentType => ({
  type: SET_DRAGGING_COMPONENT_TYPE,
  componentType,
});

export default handleActions(
  {
    [SET_DRAGGING_COMPONENT_TYPE]: (state, { componentType }) => ({
      componentType,
    }),
  },
  { componentType: null },
);
