const TOGGLE_LOADING = 'TOGGLE_LOADING'

const toggleLoading = isLoading => ({
  type: TOGGLE_LOADING,
  payload: isLoading,
})

const relayLoading = (state = null, action) => {
  switch (action.type) {
    case 'TOGGLE_LOADING':
      return action.payload
    default:
      return state
  }
}

/*----------------------------------------------------------------------------*/

export default relayLoading
export { toggleLoading }
