// @flow
import { namespaceActions } from './utils';
import { REHYDRATE } from 'redux-persist/constants';
import _ from 'lodash';

const sets = namespaceActions('sets', [
  'ADD_ANALYSIS',
  'REMOVE_ANALYSIS',
  'REMOVE_ALL_ANALYSIS',
  'ADD_CLINICAL_ANALYSIS_VARIABLE',
  'REMOVE_CLINICAL_ANALYSIS_VARIABLE',
  'UPDATE_CLINICAL_ANALYSIS_VARIABLE',
  'UPDATE_CLINICAL_ANALYSIS_PROPERTY',
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
  variableKey?: string,
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

const addClinicalAnalysisVariable = (payload: TPayload) => ({
  type: sets.ADD_CLINICAL_ANALYSIS_VARIABLE,
  payload,
});

const removeClinicalAnalysisVariable = (payload: TPayload) => ({
  type: sets.REMOVE_CLINICAL_ANALYSIS_VARIABLE,
  payload,
});

const updateClinicalAnalysisVariable = (payload: TPayload) => ({
  type: sets.UPDATE_CLINICAL_ANALYSIS_VARIABLE,
  payload,
});

const updateClinicalAnalysisProperty = (payload: TPayload) => ({
  type: sets.UPDATE_CLINICAL_ANALYSIS_PROPERTY,
  payload,
});

const initialState = {
  saved: [],
};

const defaultVariableConfig = {
  active_chart: 'survival',
  active_calculation: 'number',
  bins: [],
};

const getCurrentAnalysis = (currentState, analysisId) => {
  const currentAnalysisIndex = currentState.saved.findIndex(
    a => a.id === analysisId
  );
  const currentAnalysis = currentState.saved.slice(0)[currentAnalysisIndex];

  return { currentAnalysisIndex, currentAnalysis };
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

    // adds new card to analysis
    case sets.ADD_CLINICAL_ANALYSIS_VARIABLE: {
      const { currentAnalysisIndex, currentAnalysis } = getCurrentAnalysis(
        state,
        action.payload.id
      );

      if (currentAnalysisIndex < 0) {
        return state;
      }

      return {
        ...state,
        saved: [
          ...state.saved.slice(0, currentAnalysisIndex),
          {
            ...currentAnalysis,
            variables: {
              [action.payload.fieldName]: {
                ...defaultVariableConfig,
                type: action.payload.fieldType,
                fieldName: action.payload.fieldName,
                plotTypes: action.payload.plotTypes,
              },
              ...currentAnalysis.variables,
            },
          },
          ...state.saved.slice(currentAnalysisIndex + 1, Infinity),
        ],
      };
    }

    // removes card from analysis
    case sets.REMOVE_CLINICAL_ANALYSIS_VARIABLE: {
      const { currentAnalysisIndex, currentAnalysis } = getCurrentAnalysis(
        state,
        action.payload.id
      );

      if (currentAnalysisIndex < 0) {
        return state;
      }

      return {
        ...state,
        saved: [
          ...state.saved.slice(0, currentAnalysisIndex),
          {
            ...currentAnalysis,
            variables: _.pickBy(
              currentAnalysis.variables,
              (value, key) => key !== action.payload.fieldName
            ),
          },
          ...state.saved.slice(currentAnalysisIndex + 1, Infinity),
        ],
      };
    }

    // updates value for single variable
    case sets.UPDATE_CLINICAL_ANALYSIS_VARIABLE: {
      const { currentAnalysisIndex, currentAnalysis } = getCurrentAnalysis(
        state,
        action.payload.id
      );

      if (currentAnalysisIndex < 0) {
        return state;
      }

      return {
        ...state,
        saved: [
          ...state.saved.slice(0, currentAnalysisIndex),
          {
            ...currentAnalysis,
            variables: {
              ...currentAnalysis.variables,
              [action.payload.fieldName]: {
                ...currentAnalysis.variables[action.payload.fieldName],
                [action.payload.variableKey]: action.payload.value,
              },
            },
          },
          ...state.saved.slice(currentAnalysisIndex + 1, Infinity),
        ],
      };
    }

    // updates non-variable key in analysis
    case sets.UPDATE_CLINICAL_ANALYSIS_PROPERTY: {
      const { currentAnalysisIndex, currentAnalysis } = getCurrentAnalysis(
        state,
        action.payload.id
      );

      if (currentAnalysisIndex < 0) {
        return state;
      }

      return {
        ...state,
        saved: [
          ...state,
          ...state.saved.slice(0, currentAnalysisIndex),
          {
            ...currentAnalysis,
            [action.payload.property]: action.payload.value,
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
  addClinicalAnalysisVariable,
  removeClinicalAnalysisVariable,
  updateClinicalAnalysisVariable,
  updateClinicalAnalysisProperty,
};

export default reducer;
