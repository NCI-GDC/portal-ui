// @flow
import { namespaceActions } from './utils';
// import { REHYDRATE } from 'redux-persist/lib/constants';

const sets = namespaceActions('sets', [
  'ADD_ANALYSIS',
  'REMOVE_ANALYSIS',
  'REMOVE_ALL_ANALYSIS',
]);

type TState = {
  saved: Array<{
    id: string,
    sets: Object,
    type: string,
    created: string,
    message?: string,
  }>,
};
type TPayload = {
  analysis?: TState,
  id: string,
};
type TAction = {
  type: sets.ADD_ANALYSIS | sets.REMOVE_ANALYSIS | sets.REMOVE_ALL_ANALYSIS,
  payload: TPayload,
};

const addAnalysis = (payload: TPayload) => ({
  type: sets.ADD_ANALYSIS,
  payload,
});

const removeAnalysis = (payload: TPayload) => ({
  type: sets.REMOVE_ANALYSIS,
  payload,
});

const removeAllAnalysis = () => ({
  type: sets.REMOVE_ALL_ANALYSIS,
});

const initialState = {
  saved: [],
};

const reducer = (state: TState = initialState, action: TAction) => {
  switch (action.type) {
    // case REHYDRATE:
    //   return {
    //     ...state,
    //     ...action.payload.analysis,
    //   };
    case sets.ADD_ANALYSIS: {
      return {
        ...state,
        saved: [...state.saved, action.payload],
      };
    }

    case sets.REMOVE_ANALYSIS: {
      return {
        ...state,
        saved: state.saved.filter(s => s.id !== action.payload.id),
      };
    }
    case sets.REMOVE_ALL_ANALYSIS: {
      return {
        ...state,
        saved: [],
      };
    }

    default:
      return state;
  }
};

/*----------------------------------------------------------------------------*/

export { addAnalysis, removeAnalysis, removeAllAnalysis };

export default reducer;
