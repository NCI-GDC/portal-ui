// @flow
import { omit, trim } from 'lodash';
import { namespaceActions } from './utils';

export type TSetTypes = 'case' | 'ssm' | 'gene';

type TState = {
  [TSetTypes]: String,
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

const sets = namespaceActions('sets', [
  'ADD_SET',
  'REMOVE_SET',
  'REPLACE_SET',
  'UPDATE_SET',
]);

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

const updateSet: TActionCreator = payload => ({
  type: sets.UPDATE_SET,
  payload,
});

const initialState = {};

const trimAll = s => trim(s).replace(/\s+/g, ' ');

const reducer = (state: TState = initialState, action: TAction) => {
  const payload = action.payload;
  switch (action.type) {

    case sets.ADD_SET:
      return {
        ...state,
        [payload.type]: {
          ...state[payload.type],
          [payload.id]: trimAll(payload.label) || '',
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

    case sets.UPDATE_SET:
      return {
        ...state,
        [payload.type]: {
          ...state[payload.type],
          [payload.id]: trimAll(payload.label),
        },
      };

    default:
      return state;
  }
};

/*----------------------------------------------------------------------------*/

export { addSet, removeSet, replaceSet, updateSet };

export default reducer;
