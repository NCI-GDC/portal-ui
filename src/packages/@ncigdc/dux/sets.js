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

const sets = namespaceActions('sets', ['ADD_SET', 'REMOVE_SET']);

const addSet: TActionCreator = payload => ({
  type: sets.ADD_SET,
  payload,
});

const removeSet: TActionCreator = payload => ({
  type: sets.REMOVE_SET,
  payload,
});

const initialState = {};

const reducer = (state: TState = initialState, action: TAction) => {
  switch (action.type) {
    case REHYDRATE:
      return {
        ...state,
        ...action.payload.sets,
      };
    case sets.ADD_SET: {
      const { label = '', id, type } = action.payload;

      return {
        ...state,
        [type]: {
          ...state[type],
          [label]: id,
        },
      };
    }

    case sets.REMOVE_SET: {
      const { label, type } = action.payload;

      return {
        ...state,
        [type]: omit(state[type], label),
      };
    }

    default:
      return state;
  }
};

/*----------------------------------------------------------------------------*/

export { addSet, removeSet };

export default reducer;
