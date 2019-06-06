export const dataDimensions = {
  age_at_diagnosis: {
    axisTitle: 'Age',
    unit: 'Years',
  },
  cigarettes_per_day: {},
  circumferential_resection_margin: {},
  days_to_birth: { unit: 'Days' },
  days_to_death: { unit: 'Days' },
  days_to_hiv_diagnosis: { unit: 'Days' },
  days_to_last_follow_up: { unit: 'Days' },
  days_to_last_known_disease_status: { unit: 'Days' },
  days_to_new_event: { unit: 'Days' },
  days_to_recurrence: { unit: 'Days' },
  days_to_treatment_end: { unit: 'Days' },
  days_to_treatment_start: { unit: 'Days' },
  height: {
    axisTitle: 'Height',
    unit: 'cm',
  },
  // ldh_level_at_diagnosis
  // ldh_normal_range_upper
  lymph_nodes_positive: {},
  pack_years_smoked: {},
  tumor_largest_dimension_diameter: {
    axisTitle: 'Diameter',
    unit: 'cm',
  },
  weight: {
    axisTitle: 'Weight',
    unit: 'kg',
  },
  year_of_diagnosis: { unit: 'Years' },
  years_smoked: { unit: 'Years' },
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
