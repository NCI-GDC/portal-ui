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
  k => localStorage[k],
);

const DATA_CATEGORIES_COMMON = { // this object is "sorted" on purpose, do not rearrange the keys
  SEQ: {
    abbr: 'Seq',
    full: 'Sequencing Reads',
  },
  EXP: {
    abbr: 'Exp',
    full: 'Transcriptome Profiling',
  },
  SNV: {
    abbr: 'SNV',
    full: 'Simple Nucleotide Variation',
  },
  CNV: {
    abbr: 'CNV',
    full: 'Copy Number Variation',
  },
  METH: {
    abbr: 'Meth',
    full: 'DNA Methylation',
  },
};

export const DATA_CATEGORIES = { // this object is "sorted" on purpose, do not rearrange the keys
  ...DATA_CATEGORIES_COMMON,
  CLINICAL: {
    abbr: 'Clinical',
    full: 'Clinical',
  },
  BIOSPECIMEN: {
    abbr: 'Bio',
    full: 'Biospecimen',
  },
};

export const DATA_CATEGORIES_FOR_PROJECTS_TABLE = { // this object is "sorted" on purpose, do not rearrange the keys
  ...DATA_CATEGORIES_COMMON,
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

export const HUMAN_BODY_MAPPINGS = {
  'Adrenal Gland': {
    byPrimarySite: ['Adrenal gland'],
    byTissueOrOrganOfOrigin: [
      'Adrenal gland, NOS',
      'Cortex of adrenal gland',
      'Medulla of adrenal gland',
    ],
  },
  'Bile Duct': {
    byPrimarySite: ['Other and unspecified parts of biliary tract'],
    byTissueOrOrganOfOrigin: [
      'Ampulla of Vater',
      'Biliary tract, NOS',
      'Extrahepatic bile duct',
      'Overlapping lesion of biliary tract',
    ],
  },
  Bladder: {
    byPrimarySite: ['Bladder'],
    byTissueOrOrganOfOrigin: [
      'Anterior wall of bladder',
      'Bladder neck',
      'Bladder, NOS',
      'Dome of bladder',
      'Lateral wall of bladder',
      'Overlapping lesion of bladder',
      'Posterior wall of bladder',
      'Trigone of bladder',
      'Urachus',
      'Ureteric orifice',
    ],
  },
  Bone: {
    byPrimarySite: [
      'Bones, joints and articular cartilage of limbs',
      'Bones, joints and articular cartilage of other and unspecified sites',
      'Other and ill-defined sites',
    ],
    byTissueOrOrganOfOrigin: [
      'Bone of limb, NOS',
      'Bone, NOS',
      'Bones of skull and face and associated joints',
      'Long bones of lower limb and associated joints',
      'Long bones of upper limb, scapula and associated joints',
      'Mandible',
      'Overlapping lesion of bones, joints and articular cartilage of limbs',
      'Overlapping lesion of bones, joints and articular cartilage',
      'Pelvic bones, sacrum, coccyx and associated joints',
      'Pelvis, NOS',
      'Rib, sternum, clavicle and associated joints',
      'Short bones of lower limb and associated joints',
      'Short bones of upper limb and associated joints',
      'Vertebral column',
    ],
  },
  'Bone Marrow': {
    byPrimarySite: ['Hematopoietic and reticuloendothelial systems'],
    byTissueOrOrganOfOrigin: [
      'Blood',
      'Bone marrow',
      'Hematopoietic system, NOS',
      'Reticuloendothelial system, NOS',
      'Spleen',
    ],
  },
  Brain: {
    byPrimarySite: ['Brain'],
    byTissueOrOrganOfOrigin: [
      'Brain stem',
      'Brain, NOS',
      'Cerebellum, NOS',
      'Cerebrum',
      'Frontal lobe',
      'Occipital lobe',
      'Overlapping lesion of brain',
      'Parietal lobe',
      'Temporal lobe',
      'Ventricle, NOS',
    ],
  },
  Breast: {
    byPrimarySite: ['Breast'],
    byTissueOrOrganOfOrigin: [
      'Axillary tail of breast',
      'Breast, NOS',
      'Central portion of breast',
      'Lower-inner quadrant of breast',
      'Lower-outer quadrant of breast',
      'Nipple',
      'Overlapping lesion of breast',
      'Upper-inner quadrant of breast',
      'Upper-outer quadrant of breast',
    ],
  },
  Cervix: {
    byPrimarySite: ['Cervix uteri'],
    byTissueOrOrganOfOrigin: [
      'Cervix uteri',
      'Endocervix',
      'Exocervix',
      'Overlapping lesion of cervix uteri',
    ],
  },
  Colorectal: {
    byPrimarySite: [
      'Colon',
      'Rectosigmoid junction',
      'Rectum',
    ],
    byTissueOrOrganOfOrigin: [
      'Appendix',
      'Ascending colon',
      'Cecum',
      'Colon, NOS',
      'Descending colon',
      'Hepatic flexure of colon',
      'Overlapping lesion of colon',
      'Rectosigmoid junction',
      'Rectum, NOS',
      'Sigmoid colon',
      'Splenic flexure of colon',
      'Transverse colon',
    ],
  },
  Esophagus: {
    byPrimarySite: ['Esophagus'],
    byTissueOrOrganOfOrigin: [
      'Abdominal esophagus',
      'Cervical esophagus',
      'Esophagus, NOS',
      'Lower third of esophagus',
      'Middle third of esophagus',
      'Overlapping lesion of esophagus',
      'Thoracic esophagus',
      'Upper third of esophagus',
    ],
  },
  Eye: {
    byPrimarySite: ['Eye and adnexa'],
    byTissueOrOrganOfOrigin: [
      'Choroid',
      'Ciliary body',
      'Conjunctiva',
      'Cornea, NOS',
      'Eye, NOS',
      'Lacrimal gland',
      'Orbit, NOS',
      'Overlapping lesion of eye and adnexa',
      'Retina',
    ],
  },
  'Head and Neck': {
    byPrimarySite: [
      'Accessory sinuses',
      'Base of tongue',
      'Floor of mouth',
      'Gum',
      'Hypopharynx',
      'Larynx',
      'Lip',
      'Nasal cavity and middle ear',
      'Nasopharynx',
      'Oropharynx',
      'Other and ill-defined sites in lip, oral cavity and pharynx',
      'Other and ill-defined sites',
      'Other and unspecified major salivary glands',
      'Other and unspecified parts of mouth',
      'Other and unspecified parts of tongue',
      'Palate',
      'Parotid gland',
      'Pyriform sinus',
      'Tonsil',
      'Trachea',
    ],
    byTissueOrOrganOfOrigin: [
      'Accessory sinus, NOS',
      'Anterior 2/3 of tongue, NOS',
      'Anterior floor of mouth',
      'Anterior surface of epiglottis',
      'Anterior wall of nasopharynx',
      'Base of tongue, NOS',
      'Border of tongue',
      'Branchial cleft',
      'Cheek mucosa',
      'Commissure of lip',
      'Dorsal surface of tongue, NOS',
      'Ethmoid sinus',
      'External lip, NOS',
      'External lower lip',
      'External upper lip',
      'Floor of mouth, NOS',
      'Frontal sinus',
      'Glottis',
      'Gum, NOS',
      'Hard palate',
      'Head, face or neck, NOS',
      'Hypopharyngeal aspect of aryepiglottic fold',
      'Hypopharynx, NOS',
      'Laryngeal cartilage',
      'Larynx, NOS',
      'Lateral floor of mouth',
      'Lateral wall of nasopharynx',
      'Lateral wall of oropharynx',
      'Lingual tonsil',
      'Lip, NOS',
      'Lower gum',
      'Major salivary gland, NOS',
      'Maxillary sinus',
      'Middle ear',
      'Mouth, NOS',
      'Mucosa of lip, NOS',
      'Mucosa of lower lip',
      'Mucosa of upper lip',
      'Nasal cavity',
      'Nasopharynx, NOS',
      'Oropharynx, NOS',
      'Overlapping lesion of accessory sinuses',
      'Overlapping lesion of floor of mouth',
      'Overlapping lesion of hypopharynx',
      'Overlapping lesion of larynx',
      'Overlapping lesion of lip, oral cavity and pharynx',
      'Overlapping lesion of lip',
      'Overlapping lesion of major salivary glands',
      'Overlapping lesion of nasopharynx',
      'Overlapping lesion of other and unspecified parts of mouth',
      'Overlapping lesion of palate',
      'Overlapping lesion of tongue',
      'Overlapping lesion of tonsil',
      'Overlapping lesions of oropharynx',
      'Palate, NOS',
      'Parotid gland',
      'Pharynx, NOS',
      'Postcricoid region',
      'Posterior wall of hypopharynx',
      'Posterior wall of nasopharynx',
      'Posterior wall of oropharynx',
      'Pyriform sinus',
      'Retromolar area',
      'Soft palate, NOS',
      'Sphenoid sinus',
      'Subglottis',
      'Sublingual gland',
      'Submandibular gland',
      'Superior wall of nasopharynx',
      'Supraglottis',
      'Tongue, NOS',
      'Tonsil, NOS',
      'Tonsillar fossa',
      'Tonsillar pillar',
      'Trachea',
      'Upper Gum',
      'Uvula',
      'Vallecula',
      'Ventral surface of tongue, NOS',
      'Vestibule of mouth',
      'Waldeyer ring',
    ],
  },
  Kidney: {
    byPrimarySite: ['Kidney'],
    byTissueOrOrganOfOrigin: ['Kidney, NOS'],
  },
  Liver: {
    byPrimarySite: ['Liver and intrahepatic bile ducts'],
    byTissueOrOrganOfOrigin: ['intrahepatic bile duct', 'Liver'],
  },
  Lung: {
    byPrimarySite: ['Bronchus and lung'],
    byTissueOrOrganOfOrigin: [
      'Lower lobe, lung',
      'Lung, NOS',
      'Main bronchus',
      'Middle lobe, lung',
      'Overlapping lesion of lung',
      'Upper lobe, lung',
    ],
  },
  'Lymph Nodes': {
    byPrimarySite: ['Lymph nodes'],
    byTissueOrOrganOfOrigin: [
      'Intra-abdominal lymph nodes',
      'Intrathoracic lymph nodes',
      'Lymph node, NOS',
      'Lymph nodes of axilla or arm',
      'Lymph nodes of head, face and neck',
      'Lymph nodes of inguinal region or leg',
      'Lymph nodes of multiple regions',
      'Pelvic lymph nodes',
    ],
  },
  'Nervous System': {
    byPrimarySite: [
      'Meninges',
      'Peripheral nerves and autonomic nervous system',
      'Spinal cord, cranial nerves, and other parts of central nervous system',
    ],
    byTissueOrOrganOfOrigin: [
      'Acoustic nerve',
      'Autonomic nervous system, NOS',
      'Cauda equina',
      'Cerebral meninges',
      'Cranial nerve, NOS',
      'Meninges, NOS',
      'Nervous system, NOS',
      'Olfactory nerve',
      'Optic nerve',
      'Overlapping lesion of brain and central nervous system',
      'Overlapping lesion of peripheral nerves and autonomic nervous system',
      'Peripheral nerves and autonomic nervous system of abdomen',
      'Peripheral nerves and autonomic nervous system of head, face, and neck',
      'Peripheral nerves and autonomic nervous system of lower limb and hip',
      'Peripheral nerves and autonomic nervous system of pelvis',
      'Peripheral nerves and autonomic nervous system of thorax',
      'Peripheral nerves and autonomic nervous system of trunk, NOS',
      'Peripheral nerves and autonomic nervous system of upper limb and shoulder',
      'Spinal cord',
      'Spinal meninges',
    ],
  },
  'Not Reported': {
    byPrimarySite: ['Not Reported', 'unknown'],
    byTissueOrOrganOfOrigin: ['Not Reported', 'unknown'],
  },
  'Other and Ill-defined Sites': {
    byPrimarySite: [
      'Anus and anal canal',
      'Gallbladder',
      'Other and ill-defined digestive organs',
      'Other and ill-defined sites within respiratory system and intrathoracic organs',
      'Other and ill-defined sites',
      'Other and unspecified female genital organs',
      'Other and unspecified male genital organs',
      'Other and unspecified urinary organs',
      'Other endocrine glands and related structures',
      'Penis',
      'Placenta',
      'Renal pelvis',
      'Retroperitoneum and peritoneum',
      'Unknown primary site',
      'Ureter',
      'Vagina',
      'Vulva',
    ],
    byTissueOrOrganOfOrigin: [
      'Abdomen, NOS',
      'Anal canal',
      'Anus, NOS',
      'Aortic body and other paraganglia',
      'Body of penis',
      'Broad ligament',
      'Carotid body',
      'Clitoris',
      'Cloacogenic zone',
      'Craniopharyngeal duct',
      'Endocrine gland, NOS',
      'Epididymis',
      'Fallopian tube',
      'Female genital tract, NOS',
      'Gallbladder',
      'Gastrointestinal tract, NOS',
      'Glans penis',
      'Ill-defined sites within respiratory system',
      'Intestinal tract, NOS',
      'Labium majus',
      'Labium minus',
      'Lower limb, NOS',
      'Male genital organs, NOS',
      'Other ill-defined sites',
      'Other specified parts of female genital organs',
      'Other specified parts of male genital organs',
      'Overlapping lesion of digestive system',
      'Overlapping lesion of endocrine glands and related structures',
      'Overlapping lesion of female genital organs',
      'Overlapping lesion of ill-defined sites',
      'Overlapping lesion of male genital organs',
      'Overlapping lesion of penis',
      'Overlapping lesion of rectum, anus and anal canal',
      'Overlapping lesion of respiratory system and intrathoracic organs',
      'Overlapping lesion of retroperitoneum and peritoneum',
      'Overlapping lesion of urinary organs',
      'Overlapping lesion of vulva',
      'Parametrium',
      'Parathyroid gland',
      'Paraurethral gland',
      'Penis, NOS',
      'Peritoneum, NOS',
      'Pineal gland',
      'Pituitary gland',
      'Placenta',
      'Prepuce',
      'Renal pelvis',
      'Retroperitoneum',
      'Round ligament',
      'Scrotum, NOS',
      'Specified parts of peritoneum',
      'Spermatic cord',
      'Thorax, NOS',
      'Unknown primary site',
      'Upper limb, NOS',
      'Upper respiratory tract, NOS',
      'Ureter',
      'Urethra',
      'Urinary system, NOS',
      'Uterine adnexa',
      'Vagina, NOS',
      'Vulva, NOS',
    ],
  },
  Ovary: {
    byPrimarySite: ['Ovary'],
    byTissueOrOrganOfOrigin: ['Ovary'],
  },
  Pancreas: {
    byPrimarySite: ['Pancreas'],
    byTissueOrOrganOfOrigin: [
      'Body of pancreas',
      'Head of pancreas',
      'Islets of Langerhans',
      'Other specified parts of pancreas',
      'Overlapping lesion of pancreas',
      'Pancreas, NOS',
      'Pancreatic duct',
      'Tail of pancreas',
    ],
  },
  Pleura: {
    byPrimarySite: ['Heart, mediastinum, and pleura'],
    byTissueOrOrganOfOrigin: [
      'Anterior mediastinum',
      'Heart',
      'Mediastinum, NOS',
      'Overlapping lesion of heart, mediastinum and pleura',
      'Pleura, NOS',
      'Posterior mediastinum',
    ],
  },
  Prostate: {
    byPrimarySite: ['Prostate gland'],
    byTissueOrOrganOfOrigin: ['Prostate gland'],
  },
  Skin: {
    byPrimarySite: ['Skin'],
    byTissueOrOrganOfOrigin: [
      'External ear',
      'Eyelid',
      'Overlapping lesion of skin',
      'Skin of lip, NOS',
      'Skin of lower limb and hip',
      'Skin of other and unspecified parts of face',
      'Skin of scalp and neck',
      'Skin of trunk',
      'Skin of upper limb and shoulder',
      'Skin, NOS',
    ],
  },
  'Soft Tissue': {
    byPrimarySite: ['Connective, subcutaneous and other soft tissues'],
    byTissueOrOrganOfOrigin: [
      'Connective, Subcutaneous and other soft tissues of abdomen',
      'Connective, Subcutaneous and other soft tissues of head, face, and neck',
      'Connective, Subcutaneous and other soft tissues of lower limb and hip',
      'Connective, Subcutaneous and other soft tissues of pelvis',
      'Connective, Subcutaneous and other soft tissues of thorax',
      'Connective, Subcutaneous and other soft tissues of trunk, NOS',
      'Connective, Subcutaneous and other soft tissues of upper limb and shoulder',
      'Connective, Subcutaneous and other soft tissues, NOS',
      'Overlapping lesion of connective, subcutaneous and other soft tissues',
    ],
  },
  Stomach: {
    byPrimarySite: ['Small intestine', 'Stomach'],
    byTissueOrOrganOfOrigin: [
      'Body of stomach',
      'Cardia, NOS',
      'Duodenum',
      'Fundus of stomach',
      'Gastric antrum',
      'Greater curvature of stomach, NOS',
      'Ileum',
      'Jejunum',
      'Lesser curvature of stomach, NOS',
      'Meckel diverticulum',
      'Overlapping lesion of small intestine',
      'Overlapping lesion of stomach',
      'Pylorus',
      'Small intestine, NOS',
      'Stomach, NOS',
    ],
  },
  Testis: {
    byPrimarySite: ['Testis'],
    byTissueOrOrganOfOrigin: [
      'Descended testis',
      'Testis, NOS',
      'Undescended testis',
    ],
  },
  Thymus: {
    byPrimarySite: ['Thymus'],
    byTissueOrOrganOfOrigin: ['Thymus'],
  },
  Thyroid: {
    byPrimarySite: ['Thyroid gland'],
    byTissueOrOrganOfOrigin: ['Thyroid gland'],
  },
  Uterus: {
    byPrimarySite: ['Corpus uteri', 'Uterus, NOS'],
    byTissueOrOrganOfOrigin: [
      'Corpus uteri',
      'Endometrium',
      'Fundus uteri',
      'Isthmus uteri',
      'Myometrium',
      'Overlapping lesion of corpus uteri',
      'Uterus, NOS',
    ],
  },
};

export const HUMAN_BODY_MAPPER = category => Object.entries(HUMAN_BODY_MAPPINGS).reduce(
  (mainAcc, [sapiensLabel, byCategories]) => ({
    ...mainAcc,
    ...byCategories[category].reduce(
      (acc, categoryKey) => ({
        ...acc,
        [categoryKey.toLowerCase() || sapiensLabel.toLowerCase()]: sapiensLabel,
      }), {},
    ),
  }), {},
);

export const HUMAN_BODY_SITES_MAP = HUMAN_BODY_MAPPER('byPrimarySite');
export const HUMAN_BODY_TOOS_MAP = HUMAN_BODY_MAPPER('byTissueOrOrganOfOrigin');

export const HUMAN_BODY_ALL_ALLOWED_SITES = Object.keys(HUMAN_BODY_MAPPINGS)
  .filter(site => !['Not Reported', 'Other and Ill-defined Sites'].includes(site));

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

export const IS_DEV = process.env.NODE_ENV === 'development';

export const DEV_USER =
  localStorage.REACT_APP_ALLOW_FAKE_USER ||
  localStorage.REACT_APP_ALLOW_DEV_USER ||
  process.env.REACT_APP_ALLOW_DEV_USER
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

export const DEV_USER_CA = [ // controlled access mock
  {
    programs: [
      {
        name: 'FM',
        projects: ['FM-AD'],
      },
    ],
  },
];

// Example feature flag
// export const DISPLAY_CDAVE =
//   localStorage.REACT_APP_DISPLAY_CDAVE ||
//   process.env.REACT_APP_DISPLAY_CDAVE ||
//   false;

export const CLINICAL_FIELD_BLACKLIST = [
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

export const VALID_CLINICAL_TYPES = [
  'demographic',
  'diagnoses',
  'exposures',
  'treatments',
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

export const CATEGORY_COLORS = {
  'ethnicity': {
    'hispanic or latino': 'rgb(255,150,148)', // pink
    'not hispanic or latino': 'rgb(215,40,40)', // red
    'not reported': 'rgb(255,189,122)', // yellow
  },
  'gender': {
    'female': 'rgb(220,96,156)', // pink
    'male': 'rgb(67,6,147)', // purple
  },
  'race': {
    'american indian or alaska native': 'rgb(153, 223, 139)', // light green
    'asian': 'rgb(30, 117, 179)', // dark blue
    'black or african american': 'rgb(175, 200, 233)', // light blue
    'native hawaiian or other pacific islander': 'rgb(44, 160, 44)', // dark green
    'not reported': 'rgb(255, 189, 122)', // light orange
    'white': 'rgb(255, 127, 15)', // dark orange
  },
  'vital_status': {
    'alive': 'rgb(22,147,192)', // blue
    'dead': 'rgb(138,0,0)', // red
  },
};

export const DISPLAY_SUMMARY_PAGE = localStorage.REACT_APP_DISPLAY_SUMMARY_PAGE ||
  process.env.REACT_APP_DISPLAY_SUMMARY_PAGE ||
  false;

export const DISPLAY_GENE_EXPRESSION = localStorage.REACT_APP_DISPLAY_GENE_EXPRESSION ||
  process.env.REACT_APP_DISPLAY_GENE_EXPRESSION ||
  false;

export const DISPLAY_10K = localStorage.REACT_APP_DISPLAY_10K ||
  process.env.REACT_APP_DISPLAY_10K ||
  false;

// placeholder until we have an API
export const CASE_LIMIT_API = 10000;

export const DISPLAY_DAVE_CA = localStorage.REACT_APP_DISPLAY_DAVE_CA ||
  process.env.REACT_APP_DISPLAY_DAVE_CA ||
  false;

export const DISPLAY_SCRNA_SEQ = localStorage.REACT_APP_DISPLAY_SCRNA_SEQ ||
  process.env.REACT_APP_DISPLAY_SCRNA_SEQ ||
  false;

export const MOCK_SCRNA_DATA = localStorage.REACT_APP_MOCK_SCRNA_DATA ||
  process.env.REACT_APP_MOCK_SCRNA_DATA ||
  false;