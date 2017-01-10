const NOTIFY = 'NOTIFY'

const notify = payload => ({ type: NOTIFY, payload })

const initialState = {
  id: null,
  component: null,
  action: null,
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case NOTIFY:
      return action.payload
    default:
      return state
  }
}

/*----------------------------------------------------------------------------*/

export { notify }
export default reducer
