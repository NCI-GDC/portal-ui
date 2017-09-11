// @flow

const localStorage = window.localStorage || {};

export const AUTH =
  localStorage.REACT_APP_GDC_AUTH || process.env.REACT_APP_GDC_AUTH || '';
export const AUTH_API = localStorage.REACT_APP_GDC_AUTH_API || `${AUTH}/api`;
export const API = localStorage.REACT_APP_API || process.env.REACT_APP_API;

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
  case: ['submitter_id', 'project.project_id', 'case_id'],
  gene: ['symbol', 'gene_id'],
  ssm: ['genomic_dna_change', 'ssm_id'],
};

export const MAX_SET_NAME_LENGTH = 100;
