/* @flow */
const NOTIFY = 'NOTIFY';
const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';

export type TAction = { type: string, payload: any };
export type TState = { id: number, component: Object, action: string };

const notify = payload => ({ type: NOTIFY, payload });
const closeNotification = payload => ({ type: CLOSE_NOTIFICATION, payload });
const initialState = {
  id: null,
  component: null,
  action: null,
  closed: false,
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
