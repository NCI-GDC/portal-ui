// @flow
import type { TValueFilter } from '@ncigdc/utils/filters/types';
import { theme } from '@ncigdc/theme';

export const colorMap = {
  mutation: {
    missense_variant: '#2E7D32',
    frameshift_variant: '#2E7D32',
    start_lost: '#2E7D32',
    stop_lost: '#2E7D32',
    stop_gained: '#2E7D32',
  },
  cnv: {
    'Deep Loss': '#64b5f6',
    'Shallow Loss': '#64b5f6',
    Gain: '#e76a6a',
    Amplification: '#e76a6a',
  },
};

export const suggestedMutationThemes = {
  theme1: {
    missense_variant: '#2E7D32',
    frameshift_variant: '#EF6C00',
    start_lost: '#64FFDA',
    stop_lost: '#00E676',
    stop_gained: '#81D4FA',
  },

  theme2: {
    missense_variant: '#AA00FF',
    frameshift_variant: '#2E7D32',
    start_lost: '#FF4081',
    stop_lost: '#BDBDBD',
    stop_gained: '#64FFDA',
  },

  theme3: {
    missense_variant: theme.greyScale1,
    frameshift_variant: theme.greyScale2,
    start_lost: theme.greyScale3,
    stop_lost: theme.greyScale4,
    stop_gained: theme.greyScale5,
  },
  theme4: {
    missense_variant: 'red',
    frameshift_variant: 'blue',
    start_lost: 'green',
    stop_lost: 'purple',
    stop_gained: 'pink',
  },
};

export const suggestedCnvThemes = {
  theme1: {
    'Deep Loss': '#64b5f6',
    'Shallow Loss': '#64b5f6',
    Gain: '#e76a6a',
    Amplification: '#e76a6a',
  },

  theme2: {
    'Deep Loss': '#64b5f6',
    'Shallow Loss': '#64b5f6',
    Gain: '#e76a6a',
    Amplification: '#e76a6a',
  },

  theme3: {
    'Deep Loss': '#64b5f6',
    'Shallow Loss': '#64b5f6',
    Gain: '#e76a6a',
    Amplification: '#e76a6a',
  },
};

export const consequenceTypes = Object.keys(colorMap.mutation);
export const cnvChangeTypes = Object.keys(colorMap.cnv);

const filter: TValueFilter = {
  op: 'in',
  content: {
    field: 'ssms.consequence.transcript.consequence_type',
    value: consequenceTypes,
  },
};

export default filter;
