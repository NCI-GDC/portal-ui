// @flow
import { namespaceActions } from './utils';

type TState = {
  pathname?: string,
  search?: string,
  hash?: string,
  key?: string,
  state?: any,
};

type TPayload = {
  pathname: string,
  search: string,
  hash: string,
  key: string,
  state: any,
};

type TAction = {
  type: String,
  payload: TPayload,
};

type TActionCreator = (payload: TPayload) => TAction;

const backLocation = namespaceActions('backLocation', ['UPDATE']);

const updateBackLocation: TActionCreator = payload => ({
  type: backLocation.UPDATE,
  payload,
});

const initialState = {};

const reducer = (state: TState = initialState, action: TAction) => {
  const payload = action.payload;
  switch (action.type) {
    case backLocation.UPDATE:
      return payload;
    default:
      return state;
  }
};

export { updateBackLocation };

export default reducer;
