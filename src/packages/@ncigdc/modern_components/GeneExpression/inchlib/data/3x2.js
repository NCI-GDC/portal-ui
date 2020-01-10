const data = {
  column_metadata: {
    features: [
      [
        'male',
        'female',
        'male',
      ],
      [
        'american_indian_or_alaska_native',
        'asian',
        'black_or_african_american',
      ],
      [
        'not_hispanic_or_latino',
        'not_hispanic_or_latino',
        'hispanic_or_latino',
      ],
      [
        '0',
        '45',
        '90',
      ],
      [
        'alive',
        'dead',
        'alive',
      ],
      [
        '3000',
        '500',
        'not verified',
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
      0: ['ENSG00000188167', 'TMPPE'],
      1: ['ENSG00000170266', 'GLB1'],
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
      'TCGA-EO-A22U_30bc72d5-07b5-48d2-b025-bba9bcf2f09f',
      'TCGA-IB-7651_3559f697-8fec-4f36-962c-632272fe9c9c',
      'TCGA-2W-A8YY_5aeac31a-176a-4f93-a376-a93a670821bb',
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
