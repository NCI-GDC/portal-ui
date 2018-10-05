// @flow
import type { TValueFilter } from '@ncigdc/utils/filters/types';

export const colorMap = {
  mutation: {
    missense_variant: '#ff9b6c',
    frameshift_variant: '#57dba4',
    start_lost: '#ff2323',
    stop_lost: '#d3ec00',
    initiator_codon_variant: '#5abaff',
    stop_gained: '#af57db',
  },
  cnv: {
    deep_loss: '#00457c',
    shallow_loss: '#0d71e8',
    amplification: '#d33737',
    gain: '#900000',
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
