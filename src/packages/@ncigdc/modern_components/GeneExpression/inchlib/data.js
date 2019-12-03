const data = {
  column_metadata: {
    features: [
      [
        'male',
        'female',
        'unknown',
        'not_reported',
        'male',
      ],
      [
        'smoked',
        'did_not_smoke',
        'smoked',
        'did_not_smoke',
        'smoked',
      ],
      [
        '50',
        '70',
        '60',
        '40',
        '55',
      ],
    ],
    feature_names: [
      'Gender',
      'Smoking',
      'Age',
    ],
  },
  data: {
    nodes: {
      0: {
        count: 1,
        distance: 0,
        objects: ['1'],
        features: [
          3.756673529,
          1.520964521,
          0.756931363,
          0.87335077,
          1.630903247,
        ],
        parent: 14,
      },
      1: {
        count: 1,
        distance: 0,
        objects: ['2'],
        features: [
          3.506343323,
          1.922797235,
          3.901656775,
          1.511470976,
          3.791245628,
        ],
        parent: 15,
      },
      2: {
        count: 1,
        distance: 0,
        objects: ['3'],
        features: [
          6.232230099,
          6.752444135,
          6.603843283,
          5.731165098,
          6.24237503,
        ],
        parent: 10,
      },
      3: {
        count: 1,
        distance: 0,
        objects: ['4'],
        features: [
          4.316788857,
          4.246957042,
          4.246900529,
          3.454459512,
          4.314367357,
        ],
        parent: 12,
      },
      4: {
        count: 1,
        distance: 0,
        objects: ['5'],
        features: [
          7.174262606,
          6.199710451,
          6.519565266,
          7.666878596,
          6.61969068,
        ],
        parent: 11,
      },
      5: {
        count: 1,
        distance: 0,
        objects: ['6'],
        features: [
          2.328373308,
          2.315182899,
          1.406435381,
          4.310545394,
          3.290051877,
        ],
        parent: 15,
      },
      6: {
        count: 1,
        distance: 0,
        objects: ['7'],
        features: [
          4.742380331,
          4.655490821,
          3.751393093,
          4.126962277,
          4.185199899,
        ],
        parent: 12,
      },
      7: {
        count: 1,
        distance: 0,
        objects: ['8'],
        features: [
          6.332635401,
          6.150283333,
          6.230066057,
          6.103919076,
          6.283817206,
        ],
        parent: 10,
      },
      8: {
        count: 1,
        distance: 0,
        objects: ['9'],
        features: [
          6.983515911,
          6.412696068,
          6.490210048,
          6.742395297,
          6.577745875,
        ],
        parent: 11,
      },
      9: {
        count: 1,
        distance: 0,
        objects: ['10'],
        features: [
          0.333735282,
          0.211652291,
          0.578001818,
          0.64297053,
          0.522948869,
        ],
        parent: 14,
      },
      10: {
        count: 2,
        distance: 0.808,
        left_child: 2,
        parent: 13,
        right_child: 7,
      },
      11: {
        count: 2,
        distance: 0.969,
        left_child: 4,
        parent: 13,
        right_child: 8,
      },
      12: {
        count: 2,
        distance: 1.031,
        left_child: 3,
        parent: 16,
        right_child: 6,
      },
      13: {
        count: 4,
        distance: 2.206,
        left_child: 10,
        parent: 18,
        right_child: 11,
      },
      14: {
        count: 2,
        distance: 3.84,
        left_child: 0,
        parent: 17,
        right_child: 9,
      },
      15: {
        count: 2,
        distance: 3.982,
        left_child: 1,
        parent: 16,
        right_child: 5,
      },
      16: {
        count: 4,
        distance: 4.717,
        left_child: 12,
        parent: 17,
        right_child: 15,
      },
      17: {
        count: 6,
        distance: 9.004,
        left_child: 14,
        parent: 18,
        right_child: 16,
      },
      18: {
        count: 10,
        distance: 18.644,
        left_child: 13,
        right_child: 17,
      },
    },
		// used 'match sets' on the portal
    feature_names: [
			// real
			'C3N-02529',
			'C3N-02149',
			'C3N-02087',
			// stub
			'C3N-02534',
			'C3N-02933',
		],
		// ORIGINAL
		// feature_names: [
		// 	'002c41c2-6c2f-4f42-ae9c-430e23a9d5fe',
		// 	'00766340-ae8f-4cb4-8473-9fe435c6e671',
		// 	'00ca017b-9fa8-4509-ac02-91b1c42493b4',
		// 	'0115218d-3598-4e17-bf95-d1863d84027e',
		// 	'019f6b45-71cf-42f8-afa8-f59b6752ee3d',
		// ],
	},
	// 002c41c2-6c2f-4f42-ae9c-430e23a9d5fe
	// 00766340-ae8f-4cb4-8473-9fe435c6e671
	// 00ca017b-9fa8-4509-ac02-91b1c42493b4
	// 0115218d-3598-4e17-bf95-d1863d84027e
	// 019f6b45-71cf-42f8-afa8-f59b6752ee3d
  metadata: {
		// used 'match sets' on the portal
    nodes: {
      0: ['TRIM71'],
      1: ['CCR4'],
      2: ['GLB1'],
      3: ['TMPPE'],
      4: ['CRTAP'],
      5: ['SUSD5'],
      6: ['FBXL2'],
      7: ['UBP1'],
      8: ['CLASP2'],
      9: ['MATN1'],
    },
		// ORIGINAL
		// nodes: {
		// 	0: ['ENSG00000206557.5'],
		// 	1: ['ENSG00000183813.6'],
		// 	2: ['ENSG00000170266.14'],
		// 	3: ['ENSG00000188167.7'],
		// 	4: ['ENSG00000170275.13'],
		// 	5: ['ENSG00000173705.7'],
		// 	6: ['ENSG00000153558.12'],
		// 	7: ['ENSG00000153560.10'],
		// 	8: ['ENSG00000163539.14'],
		// 	9: ['ENSG00000162510.5'],
		// },
    feature_names: ['gene_id'],
  },
};

export default data;

// ENSG00000206557
// ENSG00000183813
// ENSG00000170266
// ENSG00000188167
// ENSG00000170275
// ENSG00000173705
// ENSG00000153558
// ENSG00000153560
// ENSG00000163539
// ENSG00000162510

// TRIM71
// CCR4
// GLB1
// TMPPE
// CRTAP
// SUSD5
// FBXL2
// UBP1
// CLASP2
// MATN1
