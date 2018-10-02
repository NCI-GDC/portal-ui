// @flow
import type { TValueFilter } from '@ncigdc/utils/filters/types';

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
    missense_variant: '#00e676',
    frameshift_variant: '#388e3c',
    start_lost: '#fdd835',
    stop_lost: '#a8a6a6',
    stop_gained: '#ce93d8',
  },
};

export const suggestedCnvThemes = {
  theme1: {
    'Deep Loss': '#00457c',
    'Shallow Loss': '#64b5f6',
    Gain: '#e76a6a',
    Amplification: '#900000',
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
