// @flow
import { omit } from 'lodash';
import { REHYDRATE } from 'redux-persist/constants';

import { namespaceActions } from './utils';
type TState = {
  [String]: String,
};
type TPayload = {
  sets?: TState,
  label?: String,
  id?: String,
  type?: String,
};
type TAction = {
  type: String,
  payload: TPayload,
};
type TActionCreator = (payload: TPayload) => TAction;

const sets = namespaceActions('sets', ['ADD_SET', 'REMOVE_SET', 'REPLACE_SET']);

const addSet: TActionCreator = payload => ({
  type: sets.ADD_SET,
  payload,
});

const replaceSet: TActionCreator = payload => ({
  type: sets.REPLACE_SET,
  payload,
});

const removeSet: TActionCreator = payload => ({
  type: sets.REMOVE_SET,
  payload,
});

const initialState = {};

const reducer = (state: TState = initialState, action: TAction) => {
  const payload = action.payload;
  switch (action.type) {
    case REHYDRATE:
      return {
        ...state,
        ...action.payload.sets,
      };
    case sets.ADD_SET:
      return {
        ...state,
        [payload.type]: {
          ...state[payload.type],
          [payload.id]: payload.label || '',
        },
      };

    case sets.REMOVE_SET:
      return {
        ...state,
        [payload.type]: omit(state[payload.type], payload.id),
      };

    case sets.REPLACE_SET:
      return {
        ...state,
        [payload.type]: {
          ...omit(state[payload.type], payload.oldId),
          [payload.newId]: state[payload.type][payload.oldId],
        },
      };

    default:
      return state;
  }
};

/*----------------------------------------------------------------------------*/

export { addSet, removeSet, replaceSet };

export default reducer;
