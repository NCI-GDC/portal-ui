import { namespaceActions } from './utils';
import {
  pickBy,
} from 'lodash';

import {
  DEFAULT_BIN_TYPE,
  DEFAULT_INTERVAL,
  DEFAULT_RANGES,
} from '@ncigdc/modern_components/ClinicalAnalysis/ClinicalVariableCard/helpers';

const sets: any = namespaceActions('sets', [
  'ADD_ANALYSIS',
  'REMOVE_ANALYSIS',
  'REMOVE_ALL_ANALYSIS',
  'ADD_CLINICAL_ANALYSIS_VARIABLE',
  'REMOVE_CLINICAL_ANALYSIS_VARIABLE',
  'UPDATE_CLINICAL_ANALYSIS_VARIABLE',
  'UPDATE_CLINICAL_ANALYSIS_PROPERTY',
  'UPDATE_CLINICAL_ANALYSIS_SET',
]);

interface IAnalysis {
  created: string;
  displayVariables?: any;
  id: string;
  message?: string;
  sets: any;
  type: string;
}

interface IAnalysisState {
  saved: IAnalysis[];
}

type TClinicalAnalysisProperty = 'name'; // only type mutable properties

export interface IAnalysisPayload extends IAnalysis {
  analysis?: IAnalysis;
  continuousBinType?: 'default' | 'interval' | 'range';
  customInterval?: any;
  customRanges?: any;
  fieldName?: string;
  fieldType?: string;
  id: string;
  plotTypes?: 'categorical' | 'continuous';
  property?: TClinicalAnalysisProperty;
  scrollToCard?: boolean;
  setId?: string;
  setName?: string;
  value?: string;
  variable?: any;
  variableKey?: string;
}

interface IAnalysisMultiPayload extends IAnalysis {
  id: string;
  fieldName: string;
  newState: object;
}

interface IAnalysisAction {
  type: string;
  payload: IAnalysisPayload;
}

const addAnalysis = (payload: IAnalysis) => ({
  type: sets.ADD_ANALYSIS,
  payload,
});

const removeAnalysis = (payload: IAnalysis) => ({
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

const updateClinicalAnalysisVariable = (payload: IAnalysisMultiPayload) => ({
  type: sets.UPDATE_CLINICAL_ANALYSIS_VARIABLE,
  payload,
});

const updateClinicalAnalysisProperty = (payload: IAnalysisPayload) => ({
  type: sets.UPDATE_CLINICAL_ANALYSIS_PROPERTY,
  payload,
});

const updateClinicalAnalysisSet = (payload: IAnalysisPayload) => ({
  type: sets.UPDATE_CLINICAL_ANALYSIS_SET,
  payload,
});

const initialState: IAnalysisState = {
  saved: [],
};

const defaultVariableConfig = {
  active_calculation: 'number',
  active_chart: 'histogram',
  active_survival: 'overall',
  bins: {},
  customSurvivalPlots: [],
  isSurvivalCustom: false,
  showOverallSurvival: false,
};

const defaultCategoricalVariableConfig = {
  customBinsId: '',
  customBinsSetId: '',
};

const defaultContinuousVariableConfig = {
  continuousBinType: DEFAULT_BIN_TYPE,
  customInterval: DEFAULT_INTERVAL,
  customRanges: DEFAULT_RANGES,
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
    case sets.ADD_ANALYSIS: {
      return Object.assign(
        {},
        state,
        { saved: state.saved.concat(action.payload) },
      );
    }

    case sets.REMOVE_ANALYSIS: {
      return Object.assign(
        {},
        state,
        { saved: state.saved.filter(
          analysis => analysis.id !== action.payload.id
        ) },
      );
    }

    case sets.REMOVE_ALL_ANALYSIS: {
      return Object.assign(
        {},
        state,
        { saved: [] },
      );
    }

    // adds new card to analysis
    case sets.ADD_CLINICAL_ANALYSIS_VARIABLE: {
      const { currentAnalysisIndex, currentAnalysis } = getCurrentAnalysis(
        state,
        action.payload.id
      );

      return currentAnalysisIndex < 0
        ? state
        : Object.assign(
          {},
          state,
          {
            saved: state.saved.slice(0, currentAnalysisIndex)
              .concat(Object.assign(
                {},
                currentAnalysis,
                {
                  displayVariables: Object.assign(
                    {},
                    currentAnalysis.displayVariables,
                    {
                      [action.payload.fieldName as string]: Object.assign(
                        {},
                        defaultVariableConfig,
                        action.payload.plotTypes === 'continuous'
                          ? defaultContinuousVariableConfig
                          : defaultCategoricalVariableConfig,
                        {
                          type: action.payload.fieldType,
                          plotTypes: action.payload.plotTypes,
                          scrollToCard: action.payload.scrollToCard,
                        }
                      ),
                    },
                  ),
                },
              ))
              .concat(state.saved.slice(currentAnalysisIndex + 1, Infinity)),
          }
        );
    };

    // removes card from analysis
    case sets.REMOVE_CLINICAL_ANALYSIS_VARIABLE: {
      const { currentAnalysisIndex, currentAnalysis } = getCurrentAnalysis(
        state,
        action.payload.id
      );

      return currentAnalysisIndex < 0
        ? state
        : Object.assign(
          {},
          state,
          {
            saved: state.saved.slice(0, currentAnalysisIndex)
              .concat(Object.assign(
                {},
                currentAnalysis,
                {
                  displayVariables: pickBy(
                    currentAnalysis.displayVariables,
                    (value, key) => key !== action.payload.fieldName
                  ),
                },
              ))
              .concat(state.saved.slice(currentAnalysisIndex + 1, Infinity)),
          },
        );
    }

    // updates multiple values in displayVariables
    case sets.UPDATE_CLINICAL_ANALYSIS_VARIABLE: {
      const { currentAnalysisIndex, currentAnalysis } = getCurrentAnalysis(
        state,
        action.payload.id,
      );

      return currentAnalysisIndex < 0
        ? state
        : Object.assign(
          {},
          state,
          {
            saved: state.saved.slice(0, currentAnalysisIndex)
              .concat(Object.assign(
                {},
                currentAnalysis,
                {
                  displayVariables: Object.assign(
                    {},
                    currentAnalysis.displayVariables,
                    {
                      [action.payload.fieldName as string]: Object.assign(
                        {},
                        currentAnalysis.displayVariables[action.payload.fieldName as string],
                        action.payload.variable,
                      ),
                    },
                  ),
                },
              ))
              .concat(state.saved.slice(currentAnalysisIndex + 1, Infinity)),
          },
        );
    }

    // updates non-variable key in analysis
    case sets.UPDATE_CLINICAL_ANALYSIS_PROPERTY: {
      const { currentAnalysisIndex, currentAnalysis } = getCurrentAnalysis(
        state,
        action.payload.id
      );

       return currentAnalysisIndex < 0
        ? state
        : Object.assign(
          {},
          state,
          {
            saved: state.saved.slice(0, currentAnalysisIndex)
              .concat(Object.assign(
                {},
                currentAnalysis,
                {
                  [action.payload.property as TClinicalAnalysisProperty]: action.payload.value,
                },
              ))
              .concat(state.saved.slice(currentAnalysisIndex + 1, Infinity)),
          }
        );
    }

    case sets.UPDATE_CLINICAL_ANALYSIS_SET: {
      const { currentAnalysisIndex, currentAnalysis } = getCurrentAnalysis(
        state,
        action.payload.id
      );

      return currentAnalysisIndex < 0
        ? state
        : Object.assign(
          {},
          state,
          {
            saved: state.saved.slice(0, currentAnalysisIndex)
              .concat(Object.assign(
                {},
                currentAnalysis,
                {
                  sets: {
                    case: {
                      [action.payload.setId as TClinicalAnalysisProperty]: action.payload.setName,
                    },
                  },
                },
              ))
              .concat(state.saved.slice(currentAnalysisIndex + 1, Infinity)),
          },
        );
    }

    default:
      return state;
  }
};

/*----------------------------------------------------------------------------*/

export {
  addAnalysis,
  addClinicalAnalysisVariable,
  removeAllAnalysis,
  removeAnalysis,
  removeClinicalAnalysisVariable,
  updateClinicalAnalysisProperty,
  updateClinicalAnalysisSet,
  updateClinicalAnalysisVariable,
};

export default reducer;
