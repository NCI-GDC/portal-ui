export const dataDimensions = {
  age_at_diagnosis: { unit: 'Year' },
  cigarettes_per_day: {},
  circumferential_resection_margin: {},
  days_to_birth: { unit: 'Day' },
  days_to_death: { unit: 'Day' },
  days_to_hiv_diagnosis: { unit: 'Day' },
  days_to_last_follow_up: { unit: 'Day' },
  days_to_last_known_disease_status: { unit: 'Day' },
  days_to_new_event: { unit: 'Day' },
  days_to_recurrence: { unit: 'Day' },
  days_to_treatment_end: { unit: 'Day' },
  days_to_treatment_start: { unit: 'Day' },
  height: { unit: 'cm' },
  // ldh_level_at_diagnosis
  // ldh_normal_range_upper
  lymph_nodes_positive: {},
  pack_years_smoked: {},
  tumor_largest_dimension_diameter: { unit: 'cm' },
  weight: { unit: 'kg' },
  year_of_diagnosis: { unit: 'Year' },
  years_smoked: { unit: 'Year' },
};

// TODO the following table config warrants isolating a custom component

export const boxTableAllowedStats = [
  'min',
  'max',
  'mean',
  'median',
  'sd',
  'iqr',
];

export const boxTableRenamedStats = {
  Max: 'Maximum',
  Min: 'Minimum',
  SD: 'Standard Deviation',
};
