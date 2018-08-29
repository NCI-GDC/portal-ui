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

export const DISPLAY_SLIDES =
  localStorage.REACT_APP_GDC_DISPLAY_SLIDES ||
  process.env.REACT_APP_GDC_DISPLAY_SLIDES ||
  false;

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
  'Diagnostic Slide',
  'Tissue Slide',
  'Cell Culture',
  'WGS',
  'Low Pass WGS',
  'WXS',
  'RNA-Seq',
  'miRNA-Seq',
  'Bisulfite-Seq',
  'ChIP-Seq',
  'ATAC-Seq',
  'Genotyping Array',
  'Methylation Array',
  'Targeted Sequencing',
  'Gene Expression Array',
  'Exon Array',
  'miRNA Expression Array',
  'CGH Array',
  'MSI-Mono-Dinucleotide Assay',
  'WGA',
  'ncRNA-Seq',
  'WCS',
  'CLONE',
  'POOLCLONE',
  'AMPLICON',
  'CLONEEND',
  'FINISHING',
  'MNase-Seq',
  'DNase-Hypersensitivity',
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
].map(n => n.toLowerCase());

export const MUTATION_SUBTYPE_MAP = {
  'single base substitution': 'Substitution',
  'small deletion': 'Deletion',
  'small insertion': 'Insertion',
};

export const DNA_CHANGE_MARKERS = ['del', 'ins', '>'];

export const HUMAN_BODY_SITES_MAP = {
  Brain: 'Brain',
  Breast: 'Breast',
  'Bronchus and lung': 'Lung',
  Kidney: 'Kidney',
  Ovary: 'Ovary',
  'Corpus uteri': 'Uterus',
  'Thyroid gland': 'Thyroid',
  'Prostate gland': 'Prostate',
  Skin: 'Skin',
  Colon: 'Colorectal',
  Stomach: 'Stomach',
  'Liver and intrahepatic bile ducts': 'Liver',
  Bladder: 'Bladder',
  'Cervix uteri': 'Cervix',
  'Adrenal gland': 'Adrenal Gland',
  'Hematopoietic and reticuloendothelial systems': 'Bone Marrow',
  Pancreas: 'Pancreas',
  Esophagus: 'Esophagus',
  Testis: 'Testis',
  'Other and unspecified parts of tongue': 'Head and Neck',
  'Connective, subcutaneous and other soft tissues': 'Soft Tissue',
  'Heart, mediastinum, and pleura': 'Pleura',
  'Retroperitoneum and peritoneum': 'Other and Ill-defined Sites',
  Larynx: 'Head and Neck',
  Thymus: 'Thymus',
  Rectum: 'Colorectal',
  'Uterus, NOS': 'Uterus',
  'Eye and adnexa': 'Eye',
  'Rectosigmoid junction': 'Colorectal',
  'Other and ill-defined sites in lip, oral cavity and pharynx':
    'Head and Neck',
  'Floor of mouth': 'Head and Neck',
  Tonsil: 'Head and Neck',
  'Other and unspecified parts of mouth': 'Head and Neck',
  'Lymph nodes': 'Lymph Nodes',
  'Base of tongue': 'Head and Neck',
  Gum: 'Head and Neck',
  Oropharynx: 'Head and Neck',
  Hypopharynx: 'Head and Neck',
  'Other and unspecified parts of biliary tract': 'Other and Ill-defined Sites',
  Palate: 'Head and Neck',
  'Other and ill-defined sites': 'Other and Ill-defined Sites',
  Lip: 'Head and Neck',
  'Small intestine': 'Stomach',
  'Bones, joints and articular cartilage of limbs': 'Bone',
  'Bones, joints and articular cartilage of other and unspecified sites':
    'Bone',
  'Other and unspecified major salivary glands': 'Head and Neck',
  Gallbladder: 'Other and Ill-defined Sites',
  'Peripheral nerves and autonomic nervous system':
    'Other and Ill-defined Sites',
  'Other and unspecified male genital organs': 'Other and Ill-defined Sites',
  Meninges: 'Other and Ill-defined Sites',
  'Spinal cord, cranial nerves, and other parts of central nervous system':
    'Nervous System',
  'Other endocrine glands and related structures':
    'Other and Ill-defined Sites',
  'Unknown primary site': 'Other and Ill-defined Sites',
  'Parotid gland': 'Head and Neck',
  Nasopharynx: 'Head and Neck',
  'Pyriform sinus': 'Head and Neck',
  'Anus and anal canal': 'Other and Ill-defined Sites',
  'Other and ill-defined digestive organs': 'Other and Ill-defined Sites',
  'Nasal cavity and middle ear': 'Head and Neck',
  'Accessory sinuses': 'Head and Neck',
  Trachea: 'Head and Neck',
  'Other and ill-defined sites within respiratory system and intrathoracic organs':
    'Other and Ill-defined Sites',
  Vulva: 'Other and Ill-defined Sites',
  Vagina: 'Other and Ill-defined Sites',
  'Other and unspecified female genital organs': 'Other and Ill-defined Sites',
  Placenta: 'Other and Ill-defined Sites',
  Penis: 'Other and Ill-defined Sites',
  'Renal pelvis': 'Other and Ill-defined Sites',
  Ureter: 'Other and Ill-defined Sites',
  'Other and unspecified urinary organs': 'Other and Ill-defined Sites',
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

export const FAKE_USER = process.env.REACT_APP_ALLOW_FAKE_USER
  ? {
      username: 'DEV_USER',
      projects: {
        phs_ids: {
          phs000178: ['_member_', 'read', 'delete'],
        },
        gdc_ids: {
          'TCGA-LIHC': ['read', 'delete', 'create', 'update', 'read_report'],
          'CGCI-BLGSP': ['create', 'update', 'release', 'read_report'],
          'TCGA-DEV3': ['read', 'create', 'update', 'release', 'delete'],
        },
      },
    }
  : null;

export const IS_DEV = process.env.NODE_ENV === 'development';
