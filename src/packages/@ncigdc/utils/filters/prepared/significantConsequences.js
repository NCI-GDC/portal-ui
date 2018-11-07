// @flow
import { IValueFilter } from '@ncigdc/utils/filters/types';

// TODO: for first release hiding deep_loss and amplification, shallow_loss is loss

export const colorMap = {
  mutation: {
    missense_variant: '#2E7D32',
    frameshift_variant: '#2E7D32',
    start_lost: '#2E7D32',
    stop_lost: '#2E7D32',
    stop_gained: '#2E7D32',
  },
  cnv: {
    // 'Deep Loss': '#64b5f6',
    // 'Shallow Loss': '#64b5f6',
    Loss: '#64b5f6',
    Gain: '#e76a6a',
    // Amplification: '#e76a6a',
  },
};

export const cnvColors = [
  { key: 'gain', name: 'Gain', color: '#d33737' },
  { key: 'loss', name: 'Loss', color: '#0d71e8' },
];

export const suggestedGridThemes = {
  mutation: {
    missense_variant: '#00e676',
    frameshift_variant: '#388e3c',
    start_lost: '#fdd835',
    stop_lost: '#a8a6a6',
    stop_gained: '#ce93d8',
  },
  cnv: {
    // 'Deep Loss': '#00457c',
    // 'Shallow Loss': '#64b5f6',
    Loss: '#64b5f6',
    Gain: '#e76a6a',
    // Amplification: '#900000',
  },
};

export const consequenceTypes = Object.keys(colorMap.mutation);
export const cnvChangeTypes = Object.keys(colorMap.cnv);

const filter: IValueFilter = {
  op: 'in',
  content: {
    field: 'ssms.consequence.transcript.consequence_type',
    value: consequenceTypes,
  },
};

export default filter;
