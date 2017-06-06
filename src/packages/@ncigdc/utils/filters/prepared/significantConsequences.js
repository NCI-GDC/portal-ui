// @flow
import type { TValueFilter } from "@ncigdc/utils/filters/types";

export const colorMap = {
  missense_variant: "#ff9b6c",
  frameshift_variant: "#57dba4",
  start_lost: "#ff2323",
  stop_lost: "#d3ec00",
  initiator_codon_variant: "#5abaff",
  stop_gained: "#af57db",
};

export const consequenceTypes = Object.keys(colorMap);

const filter: TValueFilter = {
  op: "in",
  content: {
    field: "ssms.consequence.transcript.consequence_type",
    value: consequenceTypes,
  },
};

export default filter;
