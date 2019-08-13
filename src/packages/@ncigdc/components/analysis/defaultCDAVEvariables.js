import {
  DEFAULT_BIN_TYPE,
  DEFAULT_INTERVAL,
  DEFAULT_RANGES,
} from '@ncigdc/modern_components/ClinicalAnalysis/ClinicalVariableCard/helpers';

const ageBronchusSurvivalBins = [
  {
    name: '7037.0-12204.0',
    values: ['7037.0-12204.0'],
  },
  {
    name: '12204.0-17371.0',
    values: ['12204.0-17371.0'],
  },
  {
    name: '17371.0-22538.0',
    values: ['17371.0-22538.0'],
  },
];

const genderBronchusSurvivalBins = [
  {
    name: 'male',
    values: ['male'],
  },
  {
    name: 'female',
    values: ['female'],
  },
  // {
  //   name: 'not reported',
  //   values: ['not reported'],
  // },
];

export default {
  // 'demographic.ethnicity': {
  //   active_calculation: 'number',
  //   active_chart: 'histogram',
  //   active_survival: 'overall',
  //   bins: {},
  //   plotTypes: 'categorical',
  //   savedSurvivalBins: [],
  //   scrollToCard: false,
  //   type: 'Demographic',
  // },
  'demographic.gender': {
    active_calculation: 'number',
    active_chart: 'histogram',
    active_survival: 'overall',
    bins: {},
    plotTypes: 'categorical',
    savedSurvivalBins: genderBronchusSurvivalBins,
    scrollToCard: false,
    type: 'Demographic',
  },
  // 'demographic.race': {
  //   active_calculation: 'number',
  //   active_chart: 'histogram',
  //   active_survival: 'overall',
  //   bins: {},
  //   plotTypes: 'categorical',
  //   savedSurvivalBins: [],
  //   scrollToCard: false,
  //   type: 'Demographic',
  // },
  // 'diagnoses.age_at_diagnosis': {
  //   active_calculation: 'number',
  //   active_chart: 'histogram',
  //   active_survival: 'overall',
  //   bins: {},
  //   continuousBinType: DEFAULT_BIN_TYPE,
  //   customInterval: DEFAULT_INTERVAL,
  //   customRanges: DEFAULT_RANGES,
  //   plotTypes: 'continuous',
  //   savedSurvivalBins: ageBronchusSurvivalBins,
  //   scrollToCard: false,
  //   type: 'Diagnosis',
  // },
  // 'diagnoses.primary_diagnosis': {
  //   active_calculation: 'number',
  //   active_chart: 'histogram',
  //   active_survival: 'overall',
  //   bins: {},
  //   plotTypes: 'categorical',
  //   savedSurvivalBins: [],
  //   scrollToCard: false,
  //   type: 'Diagnosis',
  // },
};
