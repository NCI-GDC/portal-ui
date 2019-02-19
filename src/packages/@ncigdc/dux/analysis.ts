// @flow
import { namespaceActions } from './utils';
import { REHYDRATE } from 'redux-persist/constants';
import _ from 'lodash';

const sets: any = namespaceActions('sets', [
  'ADD_ANALYSIS',
  'REMOVE_ANALYSIS',
  'REMOVE_ALL_ANALYSIS',
  'ADD_CLINICAL_ANALYSIS_VARIABLE',
  'REMOVE_CLINICAL_ANALYSIS_VARIABLE',
  'UPDATE_CLINICAL_ANALYSIS_VARIABLE',
  'UPDATE_CLINICAL_ANALYSIS_PROPERTY',
]);

interface IAnalysis {
  id: string;
  sets: any;
  type: string;
  created: string;
  message?: string;
  variables?: any;
}

interface IAnalysisState {
  saved: [IAnalysis] | [];
}

type TClinicalAnalyisVariableKey =
  | 'active_chart'
  | 'active_calculation'
  | 'bins'
  | 'type'
  | 'plotTypes';

type TClinicalAnalysisProperty = 'name'; // only type mutable properties

export interface IAnalysisPayload {
  analysis?: IAnalysis;
  id: string;
  fieldName?: string;
  type?: string;
  value?: string;
  variableKey?: string;
  fieldType?: string;
  plotTypes?: 'categorical' | 'continuous';
  property?: TClinicalAnalysisProperty;
}

interface IAnalysisAction {
  type: string;
  payload: IAnalysisPayload;
}

const addAnalysis = (payload: IAnalysisPayload) => ({
  type: sets.ADD_ANALYSIS,
  payload,
});

const removeAnalysis = (payload: IAnalysisPayload) => ({
  type: sets.REMOVE_ANALYSIS,
  payload,
});

const removeAllAnalysis = () => ({
  type: sets.REMOVE_ALL_ANALYSIS,
});

const addClinicalAnalysisVariable = (payload: IAnalysisPayload) => ({
  type: sets.ADD_CLINICAL_ANALYSIS_VARIABLE,
  payload,
});

const removeClinicalAnalysisVariable = (payload: IAnalysisPayload) => ({
  type: sets.REMOVE_CLINICAL_ANALYSIS_VARIABLE,
  payload,
});

const updateClinicalAnalysisVariable = (payload: IAnalysisPayload) => ({
  type: sets.UPDATE_CLINICAL_ANALYSIS_VARIABLE,
  payload,
});

const updateClinicalAnalysisProperty = (payload: IAnalysisPayload) => ({
  type: sets.UPDATE_CLINICAL_ANALYSIS_PROPERTY,
  payload,
});

const initialState: IAnalysisState = {
  saved: [],
};

const defaultVariableConfig = {
  active_chart: 'survival',
  active_calculation: 'number',
  bins: [],
};

interface ICurrentAnalysis {
  currentAnalysisIndex: number;
  currentAnalysis: IAnalysis;
}
type TGetCurrentAnalysis = (
  currentState: IAnalysisState,
  analysisId: string
) => ICurrentAnalysis;

const getCurrentAnalysis: TGetCurrentAnalysis = (currentState, analysisId) => {
  const currentAnalysisIndex = (currentState.saved as [IAnalysis]).findIndex(
    a => a.id === analysisId
  ) as number;
  const currentAnalysis: IAnalysis = currentState.saved.slice(0)[
    currentAnalysisIndex
  ];

  return { currentAnalysisIndex, currentAnalysis };
};

const reducer = (
  state: IAnalysisState = initialState,
  action: IAnalysisAction
) => {
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
        saved: (state.saved as [IAnalysis]).filter(
          s => s.id !== action.payload.id
        ),
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
              [action.payload.fieldName as string]: {
                ...defaultVariableConfig,
                type: action.payload.fieldType,
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
              [action.payload.fieldName as string]: {
                ...currentAnalysis.variables[
                  action.payload.fieldName as string
                ],
                [action.payload
                  .variableKey as TClinicalAnalyisVariableKey]: action.payload
                  .value,
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
          ...state.saved.slice(0, currentAnalysisIndex),
          {
            ...currentAnalysis,
            [action.payload.property as TClinicalAnalysisProperty]: action
              .payload.value,
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
