// @flow

const TOGGLE_LOADING = 'TOGGLE_LOADING';

const toggleLoading = (isLoading: boolean): Object => ({
  type: TOGGLE_LOADING,
  payload: isLoading,
});

const relayLoading = (state: boolean = false, action: Object) => {
  switch (action.type) {
    case 'TOGGLE_LOADING':
      return action.payload;
    default:
      return state;
  }
};

/*----------------------------------------------------------------------------*/

export default relayLoading;
export { toggleLoading };
