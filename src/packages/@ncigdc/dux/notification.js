/* @flow */
const NOTIFY = 'NOTIFY';

export type TAction = { type: string, payload: any };
export type TState = { id: number, component: Object, action: string };

const notify = payload => ({ type: NOTIFY, payload });

const initialState = {
  id: null,
  component: null,
  action: null,
};

function reducer(state: TState = initialState, action: TAction): TState {
  switch (action.type) {
    case NOTIFY:
      return action.payload;
    default:
      return state;
  }
}

/*----------------------------------------------------------------------------*/

export { notify };
export default reducer;
