import {
  DEFAULT_BIN_TYPE,
  DEFAULT_INTERVAL,
  DEFAULT_RANGES,
} from '@ncigdc/modern_components/ClinicalAnalysis/ClinicalVariableCard/helpers';

const ageBronchusSurvivalBins = {
  0: {
    binName: '7037.0-12204.0',
    binValues: ['7037.0-12204.0'],
  },
  1: {
    binName: '12204.0-17371.0',
    binValues: ['12204.0-17371.0'],
  },
  2: {
    binName: '17371.0-22538.0',
    binValues: ['17371.0-22538.0'],
  },
};

export default {
  // 'demographic.ethnicity': {
  //   active_calculation: 'number',
  //   active_chart: 'histogram',
  //   active_survival: 'overall',
  //   bins: {},
  //   plotTypes: 'categorical',
  //   savedSurvivalBins: {},
  //   scrollToCard: false,
  //   type: 'Demographic',
  // },

  // 'demographic.gender': {
  //   active_calculation: 'number',
  //   active_chart: 'histogram',
  //   active_survival: 'overall',
  //   bins: {},
  //   plotTypes: 'categorical',
  //   savedSurvivalBins: {},
  //   scrollToCard: false,
  //   type: 'Demographic',
  // },
  // 'demographic.race': {
  //   active_calculation: 'number',
  //   active_chart: 'histogram',
  //   active_survival: 'overall',
  //   bins: [],
  //   plotTypes: 'categorical',
  //   savedSurvivalBins: {},
  //   scrollToCard: false,
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
    plotTypes: 'continuous',
    savedSurvivalBins: ageBronchusSurvivalBins,
    scrollToCard: false,
    type: 'Diagnosis',
  },
  // 'diagnoses.primary_diagnosis': {
  //   active_calculation: 'number',
  //   active_chart: 'histogram',
  //   active_survival: 'overall',
  //   bins: {},
  //   plotTypes: 'categorical',
  //   savedSurvivalBins: {},
  //   scrollToCard: false,
  //   type: 'Diagnosis',
  // },
};
