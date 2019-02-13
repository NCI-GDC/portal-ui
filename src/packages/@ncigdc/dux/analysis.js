// @flow
import { namespaceActions } from './utils';
import { REHYDRATE } from 'redux-persist/constants';

const sets = namespaceActions('sets', [
  'ADD_ANALYSIS',
  'REMOVE_ANALYSIS',
  'REMOVE_ALL_ANALYSIS',
  'ADD_ANALYSIS_VARIABLE',
  'REMOVE_ANALYSIS_VARIABLE',
  'UPDATE_ANALYSIS_VARIABLE',
  'UPDATE_ANALYSIS_VARIABLE_KEY'
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
  type?: string,
  value?: string,
  variableKey?: string
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

const updateAnalysisVariable = (payload: TPayload) => ({
  type: sets.UPDATE_ANALYSIS_VARIABLE,
  payload,
});

const updateAnalysisVariableKey = (payload: TPayload) => ({
  type: sets.UPDATE_ANALYSIS_VARIABLE_KEY,
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
      const currentAnalysisIndex = state.saved.findIndex(
        a => a.id === action.payload.id
      );

      if (currentAnalysisIndex < 0) {
        return state
      }
      const currentAnalysis = state.saved.slice(0)[currentAnalysisIndex];
      const currentVariables = currentAnalysis.variables.slice(0);
      console.log(action.payload)
      return {
        ...state,
        saved: [
          ...state.saved.slice(0, currentAnalysisIndex),
          {
            ...currentAnalysis,
            variables: [
              ...currentVariables,
              ...[
                {
                  type: action.payload.fieldType,
                  fieldName: action.payload.fieldName,
                  active_chart: 'survival',
                  active_calculation: 'number',
                  bins: [],
                  plotTypes: action.payload.plotTypes
                },
              ],
            ],
          },
          ...state.saved.slice(currentAnalysisIndex + 1, Infinity),
        ],
      };
    }

    case sets.REMOVE_ANALYSIS_VARIABLE: {
      const currentAnalysisId = state.saved.findIndex(
        a => a.id === action.payload.id
      );
      if (currentAnalysisId < 0) {
        return state;
      }
      const currentAnalysis = state.saved.slice(0)[currentAnalysisId];
      const currentVariables = currentAnalysis.variables.slice(0);

      return {
        ...state,
        saved: [
          ...state.saved.slice(0, currentAnalysisId),
          {
            ...currentAnalysis,
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

    case sets.UPDATE_ANALYSIS_VARIABLE: {
      const currentAnalysisIndex = state.saved.findIndex(
        a => a.id === action.payload.id
      );

      if (currentAnalysisIndex < 0) {
        return state;
      }
      const currentAnalysis = state.saved.slice(0)[currentAnalysisIndex];
      // const currentVariables = currentAnalysis.variables.slice(0);
      const currentVariableIndex = currentAnalysis.variables.findIndex(
        v => v.fieldName === action.payload.fieldName
      )
      return {
        ...state,
        // saved: [
        //   ...state.saved.slice(0, currentAnalysisIndex),
        //   {
        //     ...currentAnalysis,
        //     variables: [
        //       ...currentAnalysis.variables.slice(0, currentVariableIndex),
        //       [variableKey]: value,
        //       ...currentAnalysis.variables.slice(currentVariableIndex + 1, Infinity)
        //     ],
        //   },
        //   ...state.saved.slice(currentAnalysisIndex + 1, Infinity),
        // ],
      };
    }
    case sets.UPDATE_ANALYSIS_VARIABLE_KEY: {
      const currentAnalysisIndex = state.saved.findIndex(
        a => a.id === action.payload.id
      );

      if (currentAnalysisIndex < 0) {
        return state;
      }

      const currentAnalysis = state.saved.slice(0)[currentAnalysisIndex];
      const currentVariableIndex = currentAnalysis.variables.findIndex(
        v => v.fieldName === action.payload.fieldName
      )
      console.log([
        ...currentAnalysis.variables.slice(0, currentVariableIndex),
        [action.payload.variableKey]: action.payload.value,
        ...currentAnalysis.variables.slice(currentVariableIndex + 1, Infinity)
      ])
      return {
        ...state,
        saved: [
          ...state.saved.slice(0, currentAnalysisIndex),
          {
            ...currentAnalysis,
            variables: [
              ...currentAnalysis.variables.slice(0, currentVariableIndex),
              [action.payload.variableKey]: action.payload.value,
              ...currentAnalysis.variables.slice(currentVariableIndex + 1, Infinity)
            ],
          },
          ...state.saved.slice(currentAnalysisIndex + 1, Infinity),
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
  updateAnalysisVariable,
  updateAnalysisVariableKey
};

export default reducer;
