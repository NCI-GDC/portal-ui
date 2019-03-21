export const presetFacets = [
  {
    title: 'Case',
    field: 'case_id',
    full: 'cases.case_id',
    doc_type: 'cases',
    type: 'id',
  },
  {
    title: 'Case ID',
    field: 'submitter_id',
    full: 'cases.submitter_id',
    doc_type: 'cases',
    type: 'id',
    placeholder: 'eg. TCGA-DD*, *DD*, TCGA-DD-AAVP',
  },
  {
    title: 'Primary Site',
    field: 'primary_site',
    full: 'cases.primary_site',
    doc_type: 'cases',
    type: 'keyword',
  },
  {
    title: 'Program',
    field: 'project.program.name',
    full: 'cases.project.program.name',
    doc_type: 'cases',
    type: 'keyword',
  },
  {
    title: 'Project',
    field: 'project.project_id',
    full: 'cases.project.project_id',
    doc_type: 'cases',
    type: 'terms',
  },
  {
    title: 'Disease Type',
    field: 'disease_type',
    full: 'cases.disease_type',
    doc_type: 'cases',
    type: 'keyword',
  },
  {
    title: 'Experimental Strategy',
    field: 'summary.experimental_strategies.experimental_strategy',
    full: 'cases.summary.experimental_strategies.experimental_strategy',
    doc_type: 'cases',
    type: 'keyword',
  },
  {
    title: 'Sample Type',
    field: 'samples.sample_type',
    full: 'cases.samples.sample_type',
    doc_type: 'cases',
    type: 'keyword',
  },
];

export const clinicalFacets = [
  {
    title: 'Demographic',
    field: 'demographic',
    full: 'cases.demographic',
  },
  {
    title: 'Diagnoses',
    field: 'diagnoses',
    full: 'cases.diagnoses',
    excluded: 'cases.diagnoses.treatments',
  },
  {
    title: 'Treatments',
    field: 'treatments',
    full: 'cases.diagnoses.treatments',
  },
  {
    title: 'Exposures',
    field: 'exposures',
    full: 'cases.exposures',
  },
  {
    title: 'Follow Up',
    field: 'follow_up',
    full: 'cases.follow_up',
  },
  {
    title: 'Molecular Tests',
    field: 'molecular_tests',
    full: 'cases.molecular_tests',
  },
];
