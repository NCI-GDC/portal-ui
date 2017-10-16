/**
 * @flow
 * @relayHash 30e3b28493ce64435c98005382dcdec4
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type CohortComparison_relayQueryResponse = {|
  +viewer: ?{|
    +repository: ?{|
      +result1: ?{|
        +hits: ?{|
          +total: number;
        |};
        +facets: ?any;
        +aggregations: ?{|
          +diagnoses__age_at_diagnosis: ?{|
            +stats: ?{|
              +min: ?number;
              +max: ?number;
            |};
            +histogram: ?{|
              +buckets: ?$ReadOnlyArray<?{|
                +doc_count: ?number;
                +key: ?string;
              |}>;
            |};
          |};
        |};
      |};
      +result2: ?{|
        +hits: ?{|
          +total: number;
        |};
        +facets: ?any;
        +aggregations: ?{|
          +diagnoses__age_at_diagnosis: ?{|
            +stats: ?{|
              +min: ?number;
              +max: ?number;
            |};
            +histogram: ?{|
              +buckets: ?$ReadOnlyArray<?{|
                +doc_count: ?number;
                +key: ?string;
              |}>;
            |};
          |};
        |};
      |};
    |};
  |};
|};
*/


/*
query CohortComparison_relayQuery(
  $filter1: FiltersArgument
  $filter2: FiltersArgument
  $facets: [String]!
) {
  viewer {
    repository {
      result1: cases {
        hits(filters: $filter1) {
          total
        }
        facets(filters: $filter1, facets: $facets)
        aggregations(filters: $filter1) {
          diagnoses__age_at_diagnosis {
            stats {
              min
              max
            }
            histogram(interval: 3652.4444444444) {
              buckets {
                doc_count
                key
              }
            }
          }
        }
      }
      result2: cases {
        hits(filters: $filter2) {
          total
        }
        facets(filters: $filter2, facets: $facets)
        aggregations(filters: $filter2) {
          diagnoses__age_at_diagnosis {
            stats {
              min
              max
            }
            histogram(interval: 3652.4444444444) {
              buckets {
                doc_count
                key
              }
            }
          }
        }
      }
    }
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "filter1",
        "type": "FiltersArgument",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "filter2",
        "type": "FiltersArgument",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "facets",
        "type": "[String]!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CohortComparison_relayQuery",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "Root",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Repository",
            "name": "repository",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": "result1",
                "args": null,
                "concreteType": "RepositoryCases",
                "name": "cases",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "filters",
                        "variableName": "filter1",
                        "type": "FiltersArgument"
                      }
                    ],
                    "concreteType": "CaseConnection",
                    "name": "hits",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "total",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "facets",
                        "variableName": "facets",
                        "type": "[String]!"
                      },
                      {
                        "kind": "Variable",
                        "name": "filters",
                        "variableName": "filter1",
                        "type": "FiltersArgument"
                      }
                    ],
                    "name": "facets",
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "filters",
                        "variableName": "filter1",
                        "type": "FiltersArgument"
                      }
                    ],
                    "concreteType": "CaseAggregations",
                    "name": "aggregations",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "args": null,
                        "concreteType": "NumericAggergations",
                        "name": "diagnoses__age_at_diagnosis",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "args": null,
                            "concreteType": "Stats",
                            "name": "stats",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "min",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "max",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "interval",
                                "value": 3652.4444444444,
                                "type": "Float"
                              }
                            ],
                            "concreteType": "Aggregations",
                            "name": "histogram",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "args": null,
                                "concreteType": "Bucket",
                                "name": "buckets",
                                "plural": true,
                                "selections": [
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "doc_count",
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "key",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": "histogram{\"interval\":3652.4444444444}"
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": "result2",
                "args": null,
                "concreteType": "RepositoryCases",
                "name": "cases",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "filters",
                        "variableName": "filter2",
                        "type": "FiltersArgument"
                      }
                    ],
                    "concreteType": "CaseConnection",
                    "name": "hits",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "total",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "facets",
                        "variableName": "facets",
                        "type": "[String]!"
                      },
                      {
                        "kind": "Variable",
                        "name": "filters",
                        "variableName": "filter2",
                        "type": "FiltersArgument"
                      }
                    ],
                    "name": "facets",
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "filters",
                        "variableName": "filter2",
                        "type": "FiltersArgument"
                      }
                    ],
                    "concreteType": "CaseAggregations",
                    "name": "aggregations",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "args": null,
                        "concreteType": "NumericAggergations",
                        "name": "diagnoses__age_at_diagnosis",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "args": null,
                            "concreteType": "Stats",
                            "name": "stats",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "min",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "max",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "interval",
                                "value": 3652.4444444444,
                                "type": "Float"
                              }
                            ],
                            "concreteType": "Aggregations",
                            "name": "histogram",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "args": null,
                                "concreteType": "Bucket",
                                "name": "buckets",
                                "plural": true,
                                "selections": [
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "doc_count",
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "key",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": "histogram{\"interval\":3652.4444444444}"
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Root"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "CohortComparison_relayQuery",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "filter1",
        "type": "FiltersArgument",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "filter2",
        "type": "FiltersArgument",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "facets",
        "type": "[String]!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "CohortComparison_relayQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "Root",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Repository",
            "name": "repository",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": "result1",
                "args": null,
                "concreteType": "RepositoryCases",
                "name": "cases",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "filters",
                        "variableName": "filter1",
                        "type": "FiltersArgument"
                      }
                    ],
                    "concreteType": "CaseConnection",
                    "name": "hits",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "total",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "facets",
                        "variableName": "facets",
                        "type": "[String]!"
                      },
                      {
                        "kind": "Variable",
                        "name": "filters",
                        "variableName": "filter1",
                        "type": "FiltersArgument"
                      }
                    ],
                    "name": "facets",
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "filters",
                        "variableName": "filter1",
                        "type": "FiltersArgument"
                      }
                    ],
                    "concreteType": "CaseAggregations",
                    "name": "aggregations",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "args": null,
                        "concreteType": "NumericAggergations",
                        "name": "diagnoses__age_at_diagnosis",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "args": null,
                            "concreteType": "Stats",
                            "name": "stats",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "min",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "max",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "interval",
                                "value": 3652.4444444444,
                                "type": "Float"
                              }
                            ],
                            "concreteType": "Aggregations",
                            "name": "histogram",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "args": null,
                                "concreteType": "Bucket",
                                "name": "buckets",
                                "plural": true,
                                "selections": [
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "doc_count",
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "key",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": "histogram{\"interval\":3652.4444444444}"
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": "result2",
                "args": null,
                "concreteType": "RepositoryCases",
                "name": "cases",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "filters",
                        "variableName": "filter2",
                        "type": "FiltersArgument"
                      }
                    ],
                    "concreteType": "CaseConnection",
                    "name": "hits",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "total",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "facets",
                        "variableName": "facets",
                        "type": "[String]!"
                      },
                      {
                        "kind": "Variable",
                        "name": "filters",
                        "variableName": "filter2",
                        "type": "FiltersArgument"
                      }
                    ],
                    "name": "facets",
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "filters",
                        "variableName": "filter2",
                        "type": "FiltersArgument"
                      }
                    ],
                    "concreteType": "CaseAggregations",
                    "name": "aggregations",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "args": null,
                        "concreteType": "NumericAggergations",
                        "name": "diagnoses__age_at_diagnosis",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "args": null,
                            "concreteType": "Stats",
                            "name": "stats",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "min",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "max",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "interval",
                                "value": 3652.4444444444,
                                "type": "Float"
                              }
                            ],
                            "concreteType": "Aggregations",
                            "name": "histogram",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "args": null,
                                "concreteType": "Bucket",
                                "name": "buckets",
                                "plural": true,
                                "selections": [
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "doc_count",
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "key",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": "histogram{\"interval\":3652.4444444444}"
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "query CohortComparison_relayQuery(\n  $filter1: FiltersArgument\n  $filter2: FiltersArgument\n  $facets: [String]!\n) {\n  viewer {\n    repository {\n      result1: cases {\n        hits(filters: $filter1) {\n          total\n        }\n        facets(filters: $filter1, facets: $facets)\n        aggregations(filters: $filter1) {\n          diagnoses__age_at_diagnosis {\n            stats {\n              min\n              max\n            }\n            histogram(interval: 3652.4444444444) {\n              buckets {\n                doc_count\n                key\n              }\n            }\n          }\n        }\n      }\n      result2: cases {\n        hits(filters: $filter2) {\n          total\n        }\n        facets(filters: $filter2, facets: $facets)\n        aggregations(filters: $filter2) {\n          diagnoses__age_at_diagnosis {\n            stats {\n              min\n              max\n            }\n            histogram(interval: 3652.4444444444) {\n              buckets {\n                doc_count\n                key\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
};

module.exports = batch;
