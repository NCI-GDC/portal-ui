const data = {
  column_metadata: {
    features: [
      [
        'male',
        'female',
        'male',
      ],
      [
        'black_or_african_american',
        'american_indian_or_alaska_native',
        'not_reported',
      ],
      [
        'not_hispanic_or_latino',
        'hispanic_or_latino',
        'not_hispanic_or_latino',
      ],
      [
        '90',
        '75',
        '50',
      ],
      [
        'alive',
        'dead',
        'alive',
      ],
      [
        '0',
        '500',
        '1500',
      ],
    ],
    feature_names: [
      'Gender',
      'Race',
      'Ethnicity',
      'Age at Diagnosis',
      'Vital Status',
      'Days to Death',
    ],
  },
  metadata: {
    nodes: {
      0: ['ENSG000003UUEEO', 'R9TO'],
      1: ['ENSG0000013JD7E', '9JVV'],
    },
    feature_names: ['gene_ensembl', 'gene_symbol'],
  },
  data: {
    nodes: {
      0: {
        count: 1,
        distance: 0,
        objects: ['1'],
        features: [
          0.756931363,
          1.520964521,
          3.756673529,
        ],
        parent: 2,
      },
      1: {
        count: 1,
        distance: 0,
        objects: ['2'],
        features: [
          3.901656775,
          1.922797235,
          3.506343323,
        ],
        parent: 2,
      },
      2: {
        count: 2,
        distance: 3.18,
        left_child: 0,
        right_child: 1,
      },
    },
    feature_names: [
      'TCGA-G9-ENPS_klu11i19-38fn-a86n-xhhk-ehsq0bg7dht6',
      'TCGA-YM-D4NA_q7n5j4dr-ce9y-apy6-b1ic-anbwredwk0ar',
      'TCGA-RZ-9PQT_6kcbmrht-5p5h-gf7d-7ts2-04bq6cqhixx6',
    ],
  },
  column_dendrogram: {
    nodes: {
      0: {
        count: 1,
        distance: 0,
        parent: 4,
      },
      1: {
        count: 1,
        distance: 0,
        parent: 3,
      },
      2: {
        count: 1,
        distance: 0,
        parent: 3,
      },
      3: {
        count: 2,
        distance: 2.121,
        left_child: 1,
        parent: 4,
        right_child: 2,
      },
      4: {
        count: 3,
        distance: 3.1,
        left_child: 0,
        right_child: 3,
      },
    },
  },
};

export default data;
