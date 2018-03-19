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
  process.env.REACT_APP_SLIDE_IMAGE_ENDPOINT;

export const DISPLAY_SLIDES = localStorage.REACT_APP_GDC_DISPLAY_SLIDES || true;

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
  bladder: 'Bladder',
  breast: 'Breast',
  esophagus: 'Esophagus',
  'other and ill-defined sites': 'Other And Ill-Defined Sites',
  'other and unspecified major salivary glands': 'Head and Neck',
  kidney: 'Kidney',
  'not reported': 'Not Reported',
  unknown: 'Not Reported',
  ovary: 'Ovary',
  pancreas: 'Pancreas',
  thymus: 'Thymus',
  'thyroid gland': 'Thyroid',
  'bronchus and lung': 'Lung',
  nasopharynx: 'Head and Neck',
  'prostate gland': 'Prostate',
  'anus and anal canal': 'Other And Ill-Defined Sites',
  'cervix uteri': 'Cervix',
  penis: 'Other And Ill-Defined Sites',
  rectum: 'Colorectal',
  skin: 'Skin',
  vagina: 'Other And Ill-Defined Sites',
  vulva: 'Other And Ill-Defined Sites',
  ureter: 'Other And Ill-Defined Sites',
  colon: 'Colorectal',
  'other and unspecified parts of biliary tract': 'Bile Duct',
  hypopharynx: 'Head and Neck',
  'small intestine': 'Other And Ill-Defined Sites',
  'other and unspecified female genital organs': 'Other And Ill-Defined Sites',
  gallbladder: 'Other And Ill-Defined Sites',
  'retroperitoneum and peritoneum': 'Other And Ill-Defined Sites',
  stomach: 'Stomach',
  uterus: 'Uterus',
  'uterus, nos': 'Uterus',
  'liver and intrahepatic bile ducts': 'Liver',
  trachea: 'Head and Neck',
  'other endocrine glands and related structures':
    'Other And Ill-Defined Sites',
  'adrenal gland': 'Adrenal Gland',
  'eye and adnexa': 'Eye',
  'other and ill-defined digestive organs': 'Other And Ill-Defined Sites',
  'heart, mediastinum, and pleura': 'Pleura',
  testis: 'Testis',
  'spinal cord, cranial nerves, and other parts of central nervous system':
    'Nervous System',
  'peripheral nerves and autonomic nervous system':
    'Other And Ill-Defined Sites',
  'other and unspecified urinary organs': 'Other And Ill-Defined Sites',
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
