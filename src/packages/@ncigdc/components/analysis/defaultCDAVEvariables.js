import {
  DEFAULT_BIN_TYPE,
  DEFAULT_INTERVAL,
  DEFAULT_RANGES,
} from '@ncigdc/modern_components/ClinicalAnalysis/ClinicalVariableCard/helpers';

export default {
  // 'demographic.ethnicity': {
  //   active_calculation: 'number',
  //   active_chart: 'histogram',
  //   active_survival: 'overall',
  //   bins: {},
  //   customBinsId: '',
  //   customBinsSetId: '',
  //   customSurvivalPlots: [],
  //   isSurvivalCustom: false,
  //   plotTypes: 'categorical',
  //   scrollToCard: false,
  //   showOverallSurvival: false,
  //   type: 'Demographic',
  // },
  // 'demographic.gender': {
  //   active_calculation: 'number',
  //   active_chart: 'histogram',
  //   active_survival: 'overall',
  //   bins: {},
  //   customBinsId: '',
  //   customBinsSetId: '',
  //   customSurvivalPlots: [],
  //   isSurvivalCustom: false,
  //   plotTypes: 'categorical',
  //   scrollToCard: false,
  //   showOverallSurvival: false,
  //   type: 'Demographic',
  // },
  // 'demographic.race': {
  //   active_calculation: 'number',
  //   active_chart: 'histogram',
  //   active_survival: 'overall',
  //   bins: [],
  //   customBinsId: '',
  //   customBinsSetId: '',
  //   customSurvivalPlots: [],
  //   isSurvivalCustom: false,
  //   plotTypes: 'categorical',
  //   scrollToCard: false,
  //   showOverallSurvival: false,
  //   type: 'Demographic',
  // },
  'diagnoses.age_at_diagnosis': {
    active_calculation: 'number',
    active_chart: 'histogram',
    active_survival: 'overall',
    bins: {},
    continuousBinType: DEFAULT_BIN_TYPE,
    customInterval: DEFAULT_INTERVAL,
    customRanges: DEFAULT_RANGES,
    customSurvivalPlots: [],
    isSurvivalCustom: false,
    plotTypes: 'continuous',
    scrollToCard: false,
    showOverallSurvival: false,
    type: 'Diagnosis',
  },
  // 'diagnoses.primary_diagnosis': {
  //   active_calculation: 'number',
  //   active_chart: 'histogram',
  //   active_survival: 'overall',
  //   bins: {},
  //   customBinsId: '',
  //   customBinsSetId: '',
  //   customSurvivalPlots: [],
  //   isSurvivalCustom: false,
  //   plotTypes: 'categorical',
  //   scrollToCard: false,
  //   showOverallSurvival: false,
  //   type: 'Diagnosis',
  // },
};
