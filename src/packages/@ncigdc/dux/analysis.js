// @flow
import { namespaceActions } from './utils';
import { REHYDRATE } from 'redux-persist/constants';

const sets = namespaceActions('sets', [
  'ADD_ANALYSIS',
  'REMOVE_ANALYSIS',
  'REMOVE_ALL_ANALYSIS',
  'ADD_ANALYSIS_VARIABLE',
  'REMOVE_ANALYSIS_VARIABLE',
]);

type TState = {
  saved: Array<{
    id: string,
    sets: Object,
    type: string,
    created: string,
    message?: string,
    config: Object,
  }>,
};
type TPayload = {
  analysis?: TState,
  id: string,
  fieldName?: string,
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

const addAnalysisVariable = (payload: TPayload) => ({
  type: sets.ADD_ANALYSIS_VARIABLE,
  payload,
});

const removeAnalysisVariable = (payload: TPayload) => ({
  type: sets.REMOVE_ANALYSIS_VARIABLE,
  payload,
});

const initialState = {
  saved: [],
};

const reducer = (state: TState = initialState, action: TAction) => {
  switch (action.type) {
    case REHYDRATE:
      return {
        ...state,
        ...action.payload.analysis,
      };
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

    case sets.ADD_ANALYSIS_VARIABLE: {
      const currentAnalysisId = state.saved.findIndex(
        a => a.id === action.payload.id
      );
      const currentAnalysis = state.saved.slice(0)[currentAnalysisId];
      const currentVariables = currentAnalysis.variables.slice(0);
      return {
        ...state,
        saved: [
          ...state.saved.slice(0, currentAnalysisId),
          {
            ...state.saved.slice(0)[currentAnalysisId],
            variables: [
              ...state.saved.slice(0)[currentAnalysisId].variables,
              ...[
                {
                  type: action.payload.fieldType,
                  fieldName: action.payload.fieldName,
                  active_chart: 'survival',
                  active_calculation: 'number',
                  bins: [],
                },
              ],
            ],
          },
          ...state.saved.slice(currentAnalysisId + 1, Infinity),
        ],
      };
    }

    case sets.REMOVE_ANALYSIS_VARIABLE: {
      const currentAnalysisId = state.saved.findIndex(
        a => a.id === action.payload.id
      );
      const currentAnalysis = state.saved.slice(0)[currentAnalysisId];
      const currentVariables = currentAnalysis.variables.slice(0);

      return {
        ...state,
        saved: [
          ...state.saved.slice(0, currentAnalysisId),
          {
            ...state.saved.slice(0)[currentAnalysisId],
            variables: currentVariables
              .slice(0)
              .filter(
                variable => variable.fieldName !== action.payload.fieldName
              ),
          },
          ...state.saved.slice(currentAnalysisId + 1, Infinity),
        ],
      };
    }
    default:
      return state;
  }
};

/*----------------------------------------------------------------------------*/

export {
  addAnalysis,
  removeAnalysis,
  removeAllAnalysis,
  addAnalysisVariable,
  removeAnalysisVariable,
};

export default reducer;
