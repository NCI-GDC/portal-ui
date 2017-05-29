/* @flow */
const RESET_ERROR = 'RESET_ERROR';

export type TAction = { type: string, payload: any, error: any };
export type TState = { error: Object };

const resetError = () => ({ type: RESET_ERROR, payload: null });

const initialState = {
  error: null,
};

function errorReducer(state: TState = initialState, action: TAction): TState {
  const { type, error } = action;
  if (type === RESET_ERROR) {
    return { error: null };
  } else if (error) {
    return action.payload;
  }
  return state;
}

export { resetError };
export default errorReducer;
