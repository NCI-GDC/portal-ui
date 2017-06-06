// @flow

const UPDATE_RELAY_PROGRESS = 'UPDATE_RELAY_PROGRESS';

const updateProgress = (payload: Object): Object => ({
  type: UPDATE_RELAY_PROGRESS,
  payload,
});

const initialState = {
  percent: 0,
  event: null,
};

const reducer = (state = initialState, action: Object) => {
  switch (action.type) {
    case 'UPDATE_RELAY_PROGRESS':
      return action.payload;
    default:
      return state;
  }
};

/*----------------------------------------------------------------------------*/

type TProps = { dispatch: Function };
type THandleStateChange = (props: TProps) => (readyState: Object) => void;
const handleStateChange: THandleStateChange = props => ({ events }) => {
  props.dispatch(
    updateProgress({
      percent: events.length * 30,
      event: events[events.length - 1].type,
    }),
  );

  if (
    events.some(
      x =>
        x.type === 'NETWORK_QUERY_RECEIVED_ALL' || x.type === 'STORE_FOUND_ALL',
    )
  ) {
    props.dispatch(
      updateProgress({
        percent: 0,
        event: events[events.length - 1].type,
      }),
    );
  }
};

export default reducer;
export { updateProgress, handleStateChange };
