// @flow

export const setModal = (component, autoClose) => ({
  type: 'TOGGLE_MODAL',
  payload: {
    component,
    autoClose: typeof autoClose === 'boolean' ? autoClose : true,
  },
});

function modal(state = null, action) {
  switch (action.type) {
    case 'TOGGLE_MODAL':
      return action.payload;
    default:
      return state;
  }
}

/*----------------------------------------------------------------------------*/

export default modal;
