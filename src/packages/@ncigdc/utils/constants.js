// @flow

export const FIRST_TIME_KEY = 'NCI-Warning';
export const UI_VERSION = process.env.REACT_APP_COMMIT_TAG;
export const UI_COMMIT_HASH = process.env.REACT_APP_COMMIT_HASH;

const localStorage = window.localStorage || {};

/* API ENDPOINTS */

export const AUTH =
  localStorage.REACT_APP_GDC_AUTH || process.env.REACT_APP_GDC_AUTH || '';

export const FENCE =
  localStorage.REACT_APP_FENCE || process.env.REACT_APP_FENCE || '';

export const AUTH_API =
  localStorage.REACT_APP_GDC_AUTH_API ||
  process.env.REACT_APP_GDC_AUTH_API ||
  `${AUTH}/api`;

export const API = localStorage.REACT_APP_API || process.env.REACT_APP_API;

export const SLIDE_IMAGE_ENDPOINT =
  localStorage.REACT_APP_SLIDE_IMAGE_ENDPOINT ||
  process.env.REACT_APP_SLIDE_IMAGE_ENDPOINT;

export const AWG =
  localStorage.REACT_APP_AWG || process.env.REACT_APP_AWG || false;

export const IS_AUTH_PORTAL =
  localStorage.REACT_APP_IS_AUTH_PORTAL ||
  process.env.REACT_APP_IS_AUTH_PORTAL ||
  AWG ||
  false;

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
  k => localStorage[k]
);

const DATA_CATEGORIES_COMMON = {
  CNV: {
    abbr: 'CNV',
    full: 'Copy Number Variation',
  },
  EXP: {
    abbr: 'Exp',
    full: 'Transcriptome Profiling',
  },
  METH: {
    abbr: 'Meth',
    full: 'DNA Methylation',
  },
  SEQ: {
    abbr: 'Seq',
    full: 'Sequencing Reads',
  },
  SNV: {
    abbr: 'SNV',
    full: 'Simple Nucleotide Variation',
  },
};

export const DATA_CATEGORIES = {
  CNV: {
    abbr: 'CNV',
    full: 'Copy Number Variation',
  },
  EXP: {
    abbr: 'Exp',
    full: 'Transcriptome Profiling',
  },
  METH: {
    abbr: 'Meth',
    full: 'DNA Methylation',
  },
  SEQ: {
    abbr: 'Seq',
    full: 'Sequencing Reads',
  },
  SNV: {
    abbr: 'SNV',
    full: 'Simple Nucleotide Variation',
  },
  ...DATA_CATEGORIES_COMMON,
  BIOSPECIMEN: {
    abbr: 'Bio',
    full: 'Biospecimen',
  },
  CLINICAL: {
    abbr: 'Clinical',
    full: 'Clinical',
  },
};

export const DATA_CATEGORIES_FOR_PROJECTS_TABLE = {
  ...DATA_CATEGORIES_COMMON,
  BIOSPECIMEN_METADATA: {
    abbr: 'Bio',
    full: '',
    hasTotalLink: false,
    tooltip: 'Biospecimen Metadata',
  },
  BIOSPECIMEN_SUPPLEMENT: {
    abbr: 'Bio Supplement',
    dataCategory: 'Bio',
    full: 'Biospecimen',
    tooltip: 'Biospecimen Supplement',
  },
  CLINICAL_METADATA: {
    abbr: 'Clinical',
    full: '',
    hasTotalLink: false,
    tooltip: 'Clinical Metadata',
  },
  CLINICAL_SUPPLEMENT: {
    abbr: 'Clinical Supplement',
    dataCategory: 'Clinical',
    full: 'Clinical',
    tooltip: 'Clinical Supplement',
  },
};

export const DATA_TYPES = {
  GEQ: {
    abbr: 'GEQ',
    full: 'Gene Expression Quantification',
  },
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

export const DNA_CHANGE_MARKERS = [
  'del',
  'ins',
  '>',
];

export const HUMAN_BODY_SITES_MAP = {
  'accessory sinuses': 'Head and Neck',
  'adrenal gland': 'Adrenal Gland',
  'anus and anal canal': 'Other And Ill-Defined Sites',
  'base of tongue': 'Head and Neck',
  'bile duct': 'Bile Duct',
  bladder: 'Bladder',
  blood: 'Blood',
  bone: 'Bone',
  'bone marrow': 'Bone Marrow',
  'bones, joints and articular cartilage of limbs': 'Bone',
  'bones, joints and articular cartilage of other and unspecified sites':
    'Bone',
  brain: 'Brain',
  breast: 'Breast',
  'bronchus and lung': 'Lung',
  cervix: 'Cervix',
  'cervix uteri': 'Cervix',
  colon: 'Colorectal',
  colorectal: 'Colorectal',
  'connective, subcutaneous and other soft tissues': 'Soft Tissue',
  'corpus uteri': 'Uterus',
  esophagus: 'Esophagus',
  eye: 'Eye',
  'eye and adnexa': 'Eye',
  'floor of mouth': 'Head and Neck',
  gallbladder: 'Other And Ill-Defined Sites',
  gum: 'Head and Neck',
  'head and neck': 'Head and Neck',
  'heart, mediastinum, and pleura': 'Pleura',
  'hematopoietic and reticuloendothelial systems': 'Bone Marrow',
  hypopharynx: 'Head and Neck',
  kidney: 'Kidney',
  larynx: 'Head and Neck',
  lip: 'Head and Neck',
  liver: 'Liver',
  'liver and intrahepatic bile ducts': 'Liver',
  lung: 'Lung',
  'lymph nodes': 'Lymph Nodes',
  meninges: 'Other And Ill-Defined Sites',
  'nasal cavity and middle ear': 'Head and Neck',
  nasopharynx: 'Head and Neck',
  'nervous system': 'Nervous System',
  'not reported': 'Not Reported',
  oropharynx: 'Head and Neck',
  'other and ill-defined digestive organs': 'Other And Ill-Defined Sites',
  'other and ill-defined sites': 'Other And Ill-Defined Sites',
  'other and ill-defined sites in lip, oral cavity and pharynx': 'Head and Neck',
  'other and ill-defined sites within respiratory system and intrathoracic organs': 'Other And Ill-Defined Sites',
  'other and unspecified female genital organs': 'Other And Ill-Defined Sites',
  'other and unspecified major salivary glands': 'Head and Neck',
  'other and unspecified male genital organs': 'Other And Ill-Defined Sites',
  'other and unspecified parts of biliary tract': 'Bile Duct',
  'other and unspecified parts of mouth': 'Head and Neck',
  'other and unspecified parts of tongue': 'Head and Neck',
  'other and unspecified urinary organs': 'Other And Ill-Defined Sites',
  'other endocrine glands and related structures': 'Other And Ill-Defined Sites',
  ovary: 'Ovary',
  palate: 'Head and Neck',
  pancreas: 'Pancreas',
  'parotid gland': 'Head and Neck',
  penis: 'Other And Ill-Defined Sites',
  'peripheral nerves and autonomic nervous system':
    'Other And Ill-Defined Sites',
  placenta: 'Other And Ill-Defined Sites',
  pleura: 'Pleura',
  prostate: 'Prostate',
  'prostate gland': 'Prostate',
  'pyriform sinus': 'Head and Neck',
  'rectosigmoid junction': 'Colorectal',
  rectum: 'Colorectal',
  'renal pelvis': 'Other And Ill-Defined Sites',
  'retroperitoneum and peritoneum': 'Other And Ill-Defined Sites',
  skin: 'Skin',
  'small intestine': 'Stomach',
  'soft tissue': 'Soft Tissue',
  'spinal cord, cranial nerves, and other parts of central nervous system':
    'Nervous System',
  stomach: 'Stomach',
  testis: 'Testis',
  thymus: 'Thymus',
  thyroid: 'Thyroid',
  'thyroid gland': 'Thyroid',
  tonsil: 'Head and Neck',
  trachea: 'Head and Neck',
  unknown: 'Not Reported',
  'unknown primary site': 'Other And Ill-Defined Sites',
  ureter: 'Other And Ill-Defined Sites',
  uterus: 'Uterus',
  'uterus, nos': 'Uterus',
  vagina: 'Other And Ill-Defined Sites',
  vulva: 'Other And Ill-Defined Sites',
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
  'demographic.race': 'Race',
  'demographic.vital_status': 'Vital Status',
  'diagnoses.age_at_diagnosis': 'Age at Diagnosis',
};

export const IMPACT_SHORT_FORMS = {
  polyphen: {
    benign: 'BE',
    possibly_damaging: 'PO',
    probably_damaging: 'PR',
    unknown: 'UN',
  },
  sift: {
    deleterious: 'DH',
    deleterious_low_confidence: 'DL',
    tolerated: 'TO',
    tolerated_low_confidence: 'TL',
  },
  vep: {
    high: 'HI',
    low: 'LO',
    moderate: 'MO',
    modifier: 'MR',
  },
};

export const FAKE_USER =
  localStorage.REACT_APP_ALLOW_FAKE_USER || process.env.REACT_APP_ALLOW_FAKE_USER
    ? {
      projects: {
        gdc_ids: {
          'TCGA-LIHC': [
            'read',
            'delete',
            'create',
            'update',
            'read_report',
          ],
          'CGCI-BLGSP': [
            'create',
            'update',
            'release',
            'read_report',
          ],
          'TCGA-DEV3': [
            'read',
            'create',
            'update',
            'release',
            'delete',
          ],
        },
        phs_ids: {
          phs000178: [
            '_member_',
            'read',
            'delete',
          ],
        },
      },
      username: 'DEV_USER',
    }
    : null;

export const IS_DEV = process.env.NODE_ENV === 'development';

// Example feature flag
// export const DISPLAY_CDAVE =
//   localStorage.REACT_APP_DISPLAY_CDAVE ||
//   process.env.REACT_APP_DISPLAY_CDAVE ||
//   false;

export const CLINICAL_BLACKLIST = [
  'state',
  'score',
  'submitter_id',
  'demographic_id',
  'updated_datetime',
  'diagnosis_id',
  'created_datetime',
  'exposure_id',
  'treatment_id',
];

export const analysisColors = {
  Demographic: '#1f77b4',
  Diagnosis: '#ff7f0e',
  Exposure: '#9467bd',
  Treatment: '#2ca02c',
};

// specific string values, in case of mixed casing e.g. 'MaRS'
export const capitalisedTerms = {
  '.bmi': '.BMI',
  _bmi: '_BMI',
  'aa.': 'AA.',
  aa_: 'AA_',
  'ajc.': 'AJC.',
  ajcc: 'AJCC',
  bmi: 'BMI',
  'cog.': 'COG.',
  cog_: 'COG_',
  'dlco.': 'DLCO.',
  dlco_: 'DLCO_',
  'ecog.': 'ECOG.',
  ecog_: 'ECOG_',
  'fev1.': 'FEV1.',
  fev1_: 'FEV1_',
  'figo.': 'FIGO.',
  figo_: 'FIGO_',
  'fvc.': 'FVC.',
  fvc_: 'FVC_',
  'hiv.': 'HIV.',
  hiv_: 'HIV_',
  'hpv.': 'HPV.',
  hpv_: 'HPV_',
  'inpc.': 'INPC.',
  inpc_: 'INPC_',
  'inrg.': 'INRG.',
  inrg_: 'INRG_',
  'inss.': 'INSS.',
  inss_: 'INSS_',
  'irs.': 'IRS.',
  irs_: 'IRS_',
  'iss.': 'ISS.',
  iss_: 'ISS_',
  'ldh.': 'LDH.',
  ldh_: 'LDH_',
  'msts.': 'MSTS.',
  msts_: 'MSTS_',
};

export const DISPLAY_SUMMARY_PAGE = localStorage.REACT_APP_DISPLAY_SUMMARY_PAGE ||
  process.env.REACT_APP_DISPLAY_SUMMARY_PAGE ||
  false;
