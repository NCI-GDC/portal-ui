// @flow
import type { TValueFilter } from '@ncigdc/utils/filters/types';

export const colorMap = {
  mutation: {
    missense_variant: '#2E7D32',
    frameshift_variant: '#2E7D32',
    start_lost: '#2E7D32',
    stop_lost: '#2E7D32',
    initiator_codon_variant: '#2E7D32',
    stop_gained: '#2E7D32',
    // missense_variant: '#ff9b6c',
    // frameshift_variant: '#57dba4',
    // start_lost: '#ff2323',
    // stop_lost: '#d3ec00',
    // initiator_codon_variant: '#5abaff',
    // stop_gained: '#af57db',
  },
  cnv: {
    deep_loss: '#64b5f6',
    shallow_loss: '#64b5f6',
    gain: '#e76a6a',
    amplification: '#e76a6a',
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
