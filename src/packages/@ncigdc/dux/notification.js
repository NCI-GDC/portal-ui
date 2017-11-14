/* @flow */
const NOTIFY = 'NOTIFY';
const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';

export type TAction = { type: string, payload: any };
type TNotification = {
  id: string | null,
  component: Object | null,
  action: string | null,
};
export type TState = TNotification & {
  closed: boolean,
};

const notify = (payload: TNotification) => ({ type: NOTIFY, payload });
const closeNotification = () => ({
  type: CLOSE_NOTIFICATION,
  payload: true,
});
const initialState = {
  id: null,
  component: null,
  action: null,
  closed: true,
};

function reducer(state: TState = initialState, action: TAction): TState {
  switch (action.type) {
    case NOTIFY:
      return action.payload;
    case CLOSE_NOTIFICATION:
      return {
        ...state,
        closed: action.payload,
      };
    default:
      return state;
  }
}

/*----------------------------------------------------------------------------*/

export { notify, closeNotification };
export default reducer;
