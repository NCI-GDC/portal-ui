// @flow

const SET_LOADER = "SET_LOADER";
const REMOVE_LOADER = "REMOVE_LOADER";

const setLoader = (payload: Object): Object => ({
  type: SET_LOADER,
  payload
});

const removeLoader = (payload: Object): Object => ({
  type: REMOVE_LOADER,
  payload
});

const reducer = (state = [], action: Object) => {
  switch (action.type) {
    case SET_LOADER:
      return [...state, action.payload];
    case REMOVE_LOADER:
      return state.filter(x => x !== action.payload);
    default:
      return state;
  }
};

const handleReadyStateChange = (COMPONENT_NAME, props) => ({ events }) => {
  props.dispatch(setLoader(COMPONENT_NAME));
  const fin = events.some(
    x => x.type === "NETWORK_QUERY_RECEIVED_ALL" || x.type === "STORE_FOUND_ALL"
  );
  if (fin) props.dispatch(removeLoader(COMPONENT_NAME));
};

export default reducer;
export { setLoader, removeLoader, handleReadyStateChange };
