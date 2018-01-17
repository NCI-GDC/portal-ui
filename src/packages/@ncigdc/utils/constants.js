// @flow

export const UI_VERSION = process.env.REACT_APP_COMMIT_TAG;
export const UI_COMMIT_HASH = process.env.REACT_APP_COMMIT_HASH;

const localStorage = window.localStorage || {};

/* API ENDPOINTS */

export const AUTH =
  localStorage.REACT_APP_GDC_AUTH || process.env.REACT_APP_GDC_AUTH || '';

export const AUTH_API = localStorage.REACT_APP_GDC_AUTH_API || `${AUTH}/api`;

export const API = localStorage.REACT_APP_API || process.env.REACT_APP_API;

export const SLIDE_IMAGE_ENDPOINT =
  localStorage.REACT_APP_SLIDE_IMAGE_ENDPOINT ||
  process.env.REACT_APP_SLIDE_IMAGE_ENDPOINT ||
  'https://image.gdc.cancercollaboratory.org:8888/';

export const DISPLAY_SLIDES =
  localStorage.REACT_APP_GDC_DISPLAY_SLIDES || false;

export const API_OVERRIDE_KEYS = [
  'REACT_APP_API',
  'REACT_APP_GDC_AUTH',
  'REACT_APP_GDC_AUTH_API',
];

export const LOCAL_STORAGE_API_OVERRIDE = API_OVERRIDE_KEYS.some(
  k => localStorage[k],
);

export const DATA_CATEGORIES = {
  SEQ: { full: 'Raw Sequencing Data', abbr: 'Seq' },
  EXP: { full: 'Transcriptome Profiling', abbr: 'Exp' },
  SNV: { full: 'Simple Nucleotide Variation', abbr: 'SNV' },
  CNV: { full: 'Copy Number Variation', abbr: 'CNV' },
  METH: { full: 'DNA Methylation', abbr: 'Meth' },
  CLINICAL: { full: 'Clinical', abbr: 'Clinical' },
  BIOSPECIMEN: { full: 'Biospecimen', abbr: 'Bio' },
};

export const DATA_TYPES = {
  GEQ: { full: 'Gene Expression Quantification', abbr: 'GEQ' },
};

export const EXPERIMENTAL_STRATEGIES = [
  'Genotyping Array',
  'Gene Expression Array',
  'Exon Array',
  'miRNA Expression Array',
  'Methylation Array',
  'CGH Array',
  'MSI-Mono-Dinucleotide Assay',
  'WGS',
  'WGA',
  'WXS',
  'RNA-Seq',
  'miRNA-Seq',
  'ncRNA-Seq',
  'WCS',
  'CLONE',
  'POOLCLONE',
  'AMPLICON',
  'CLONEEND',
  'FINISHING',
  'ChIP-Seq',
  'MNase-Seq',
  'DNase-Hypersensitivity',
  'Bisulfite-Seq',
  'EST',
  'FL-cDNA',
  'CTS',
  'MRE-Seq',
  'MeDIP-Seq',
  'MBD-Seq',
  'Tn-Seq',
  'FAIRE-seq',
  'SELEX',
  'RIP-Seq',
  'ChIA-PET',
  'DNA-Seq',
  'Total RNA-Seq',
  'VALIDATION',
  'OTHER',
  'Targeted Sequencing',
].map(n => n.toLowerCase());

export const MUTATION_SUBTYPE_MAP = {
  'single base substitution': 'Substitution',
  'small deletion': 'Deletion',
  'small insertion': 'Insertion',
};

export const DNA_CHANGE_MARKERS = ['del', 'ins', '>'];

export const HUMAN_BODY_SITES_MAP = {
  Bladder: 'Bladder',
  Breast: 'Breast',
  Esophagus: 'Esophagus',
  'Other And Ill-Defined Sites': 'Other And Ill-Defined Sites',
  'Other And Unspecified Major Salivary Glands': 'Head and Neck',
  Kidney: 'Kidney',
  'Not Reported': 'Not Reported',
  Unknown: 'Not Reported',
  Ovary: 'Ovary',
  Pancreas: 'Pancreas',
  Thymus: 'Thymus',
  'Thyroid Gland': 'Thyroid',
  'Bronchus And Lung': 'Lung',
  Nasopharynx: 'Head and Neck',
  'Prostate Gland': 'Prostate',
  'Anus And Anal Canal': 'Other And Ill-Defined Sites',
  'Cervix Uteri': 'Cervix',
  Penis: 'Other And Ill-Defined Sites',
  Rectum: 'Colorectal',
  Skin: 'Skin',
  Vagina: 'Other And Ill-Defined Sites',
  Vulva: 'Other And Ill-Defined Sites',
  Ureter: 'Other And Ill-Defined Sites',
  Colon: 'Colorectal',
  'Other And Unspecified Parts Of Biliary Tract': 'Bile Duct',
  Hypopharynx: 'Head and Neck',
  'Small Intestine': 'Other And Ill-Defined Sites',
  'Other An Unspecified Female Genital Organs': 'Other And Ill-Defined Sites',
  Gallbladder: 'Other And Ill-Defined Sites',
  'Retroperitoneum And Peritoneum': 'Other And Ill-Defined Sites',
  Stomach: 'Stomach',
  Uterus: 'Uterus',
  'Uterus, NOS': 'Uterus',
  'Liver And Intrahepatic Bile Ducts': 'Liver',
  Trachea: 'Head and Neck',
  'Other Endocrine Glands And Related Structures':
    'Other And Ill-Defined Sites',
  'Adrenal Gland': 'Adrenal Gland',
  'Eye And Adnexa': 'Eye',
  'Other And Ill-Defined Digestive Organs': 'Other And Ill-Defined Sites',
  'Heart, Mediastinum, And Pleura': 'Pleura',
  Testis: 'Testis',
  'Spinal Cord, Cranial Nerves, And Other Parts Of Central Nervous System':
    'Nervous System',
  'Peripheral Nerves And Autonomic Nervous System':
    'Other And Ill-Defined Sites',
  'Other And Unspecified Urinary Organs': 'Other And Ill-Defined Sites',
};

export const HUMAN_BODY_ALL_ALLOWED_SITES = [
  'Adrenal Gland',
  'Bile Duct',
  'Bladder',
  'Blood',
  'Bone',
  'Bone Marrow',
  'Brain',
  'Breast',
  'Cervix',
  'Colorectal',
  'Esophagus',
  'Eye',
  'Head and Neck',
  'Kidney',
  'Liver',
  'Lung',
  'Lymph Nodes',
  'Nervous System',
  'Ovary',
  'Pancreas',
  'Pleura',
  'Prostate',
  'Skin',
  'Soft Tissue',
  'Stomach',
  'Testis',
  'Thymus',
  'Thyroid',
  'Uterus',
];

export const MAX_SET_SIZE = 50000;

export const SET_DOWNLOAD_FIELDS = {
  case: ['case_id'],
  gene: ['gene_id'],
  ssm: ['ssm_id'],
};

export const MAX_SET_NAME_LENGTH = 100;

export const COHORT_COMPARISON_FACETS = {
  'demographic.ethnicity': 'Ethnicity',
  'demographic.gender': 'Gender',
  'diagnoses.vital_status': 'Vital Status',
  'demographic.race': 'Race',
  'diagnoses.age_at_diagnosis': 'Age at Diagnosis',
};

export const IMPACT_SHORT_FORMS = {
  vep: {
    high: 'HI',
    moderate: 'MO',
    modifier: 'MR',
    low: 'LO',
  },
  sift: {
    deleterious: 'DH',
    deleterious_low_confidence: 'DL',
    tolerated: 'TO',
    tolerated_low_confidence: 'TL',
  },
  polyphen: {
    probably_damaging: 'PR',
    possibly_damaging: 'PO',
    benign: 'BE',
    unknown: 'UN',
  },
};

export const DEMOGRAPHIC_AND_DIAGNOSES_FIELDS = [
  'case_id',
  'case_submitter_id',
  'project.project_id',
  'demographic.demographic_id',
  'demographic.ethnicity',
  'demographic.gender',
  'demographic.year_of_birth',
  'demographic.race',
  'demographic.days_to_birth',
  'demographic.vital_status',
  'demographic.days_to_death',
  'demographic.year_of_death',
  'demographic.cause_of_death',
  'diagnoses.diagnosis_id',
  'diagnoses.ann_arbor_b_symptoms',
  'diagnoses.year_of_diagnosis',
  'diagnoses.classification_of_tumor',
  'diagnoses.last_known_disease_status',
  'diagnoses.progression_free_survival',
  'diagnoses.method_of_diagnosis',
  'diagnoses.laterality',
  'diagnoses.ann_arbor_pathologic_stage',
  'diagnoses.days_to_best_overall_response',
  'diagnoses.tumor_stage',
  'diagnoses.age_at_diagnosis',
  'diagnoses.hpv_positive_type',
  'diagnoses.vital_status',
  'diagnoses.morphology',
  'diagnoses.days_to_death',
  'diagnoses.new_event_anatomic_site',
  'diagnoses.days_to_last_known_disease_status',
  'diagnoses.perineural_invasion_present',
  'diagnoses.days_to_hiv_diagnosis',
  'diagnoses.ajcc_clinical_n',
  'diagnoses.ajcc_pathologic_t',
  'diagnoses.prior_treatment',
  'diagnoses.ajcc_clinical_t',
  'diagnoses.colon_polyps_history',
  'diagnoses.ajcc_clinical_m',
  'diagnoses.cause_of_death',
  'diagnoses.ajcc_pathologic_m',
  'diagnoses.ajcc_pathologic_n',
  'diagnoses.ldh_level_at_diagnosis',
  'diagnoses.progression_free_survival_event',
  'diagnoses.best_overall_response',
  'diagnoses.residual_disease',
  'diagnoses.days_to_recurrence',
  'diagnoses.tumor_grade',
  'diagnoses.figo_stage',
  'diagnoses.treatments.days_to_treatment_start',
  'diagnoses.treatments.days_to_treatment',
  'diagnoses.treatments.treatment_type',
  'diagnoses.treatments.therapeutic_agents',
  'diagnoses.treatments.regimen_or_line_of_therapy',
  'diagnoses.treatments.days_to_treatment_end',
  'diagnoses.treatments.treatment_anatomic_site',
  'diagnoses.treatments.treatment_outcome',
  'diagnoses.treatments.treatment_intent_type',
  'diagnoses.treatments.treatment_or_therapy',
  'diagnoses.lymphatic_invasion_present',
  'diagnoses.days_to_diagnosis',
  'diagnoses.tissue_or_organ_of_origin',
  'diagnoses.days_to_birth',
  'diagnoses.progression_or_recurrence',
  'diagnoses.primary_diagnosis',
  'diagnoses.hpv_status',
  'diagnoses.prior_malignancy',
  'diagnoses.circumferential_resection_margin',
  'diagnoses.new_event_type',
  'diagnoses.ajcc_pathologic_stage',
  'diagnoses.burkitt_lymphoma_clinical_variant',
  'diagnoses.iss_stage',
  'diagnoses.ldh_normal_range_upper',
  'diagnoses.ann_arbor_extranodal_involvement',
  'diagnoses.lymph_nodes_positive',
  'diagnoses.ann_arbor_clinical_stage',
  'diagnoses.hiv_positive',
  'diagnoses.site_of_resection_or_biopsy',
  'diagnoses.days_to_last_follow_up',
  'diagnoses.overall_survival',
  'diagnoses.ajcc_clinical_stage',
  'diagnoses.days_to_new_event',
  'diagnoses.vascular_invasion_present',
];

export const FAMILY_HISTORIES_FIELDS = [
  'case_id',
  'family_histories.family_history_id',
  'family_histories.relationship_age_at_diagnosis',
  'family_histories.relative_with_cancer_history',
  'family_histories.relationship_primary_diagnosis',
  'family_histories.relationship_type',
  'family_histories.relationship_gender',
];

export const EXPOSURES_FIELDS = [
  'case_id',
  'exposures.exposure_id',
  'exposures.cigarettes_per_day',
  'exposures.weight',
  'exposures.alcohol_history',
  'exposures.alcohol_intensity',
  'exposures.bmi',
  'exposures.years_smoked',
  'exposures.tobacco_smoking_status',
  'exposures.tobacco_smoking_onset_year',
  'exposures.tobacco_smoking_quit_year',
  'exposures.height',
  'exposures.pack_years_smoked',
];
