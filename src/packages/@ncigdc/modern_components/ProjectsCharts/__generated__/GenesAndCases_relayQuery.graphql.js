/**
 * @flow
 * @relayHash 59845e03582cd64382e21ec9f9d07290
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type GenesAndCases_relayQueryResponse = {|
  +viewer: ?{|
    +explore: ?{|
      +cases: ?{|
        +hits: ?{|
          +total: number;
        |};
      |};
      +genes: ?{|
        +hits: ?{|
          +total: number;
          +edges: ?$ReadOnlyArray<?{|
            +node: ?{|
              +score: ?number;
              +symbol: ?string;
              +gene_id: ?string;
              +filteredCases: ?{|
                +hits: ?{|
                  +total: number;
                |};
              |};
              +allCases: ?{|
                +hits: ?{|
                  +total: number;
                |};
              |};
            |};
          |}>;
        |};
      |};
    |};
  |};
|};
*/


/*
query GenesAndCases_relayQuery(
  $score: String
  $caseCount_filters: FiltersArgument
  $gene_filters: FiltersArgument
) {
  viewer {
    explore {
      cases {
        hits(first: 0, filters: $caseCount_filters) {
          total
        }
      }
      genes {
        hits(first: 20, filters: $gene_filters, score: $score) {
          total
          edges {
            node {
              score
              symbol
              gene_id
              filteredCases: case {
                hits(first: 0, filters: $gene_filters) {
                  total
                }
              }
              allCases: case {
                hits(first: 0) {
                  total
                }
              }
              id
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
        "name": "score",
        "type": "String",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "caseCount_filters",
        "type": "FiltersArgument",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "gene_filters",
        "type": "FiltersArgument",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "GenesAndCases_relayQuery",
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
            "concreteType": "Explore",
            "name": "explore",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "ExploreCases",
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
                        "variableName": "caseCount_filters",
                        "type": "FiltersArgument"
                      },
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 0,
                        "type": "Int"
                      }
                    ],
                    "concreteType": "ECaseConnection",
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
                  }
                ],
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "Genes",
                "name": "genes",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "filters",
                        "variableName": "gene_filters",
                        "type": "FiltersArgument"
                      },
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 20,
                        "type": "Int"
                      },
                      {
                        "kind": "Variable",
                        "name": "score",
                        "variableName": "score",
                        "type": "String"
                      }
                    ],
                    "concreteType": "GeneConnection",
                    "name": "hits",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "total",
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "args": null,
                        "concreteType": "GeneEdge",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "args": null,
                            "concreteType": "Gene",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "score",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "symbol",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "gene_id",
                                "storageKey": null
                              },
                              {
                                "kind": "LinkedField",
                                "alias": "filteredCases",
                                "args": null,
                                "concreteType": "GeneCases",
                                "name": "case",
                                "plural": false,
                                "selections": [
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "args": [
                                      {
                                        "kind": "Variable",
                                        "name": "filters",
                                        "variableName": "gene_filters",
                                        "type": "FiltersArgument"
                                      },
                                      {
                                        "kind": "Literal",
                                        "name": "first",
                                        "value": 0,
                                        "type": "Int"
                                      }
                                    ],
                                    "concreteType": "GeneCaseConnection",
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
                                  }
                                ],
                                "storageKey": null
                              },
                              {
                                "kind": "LinkedField",
                                "alias": "allCases",
                                "args": null,
                                "concreteType": "GeneCases",
                                "name": "case",
                                "plural": false,
                                "selections": [
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "args": [
                                      {
                                        "kind": "Literal",
                                        "name": "first",
                                        "value": 0,
                                        "type": "Int"
                                      }
                                    ],
                                    "concreteType": "GeneCaseConnection",
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
                                    "storageKey": "hits{\"first\":0}"
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
  "name": "GenesAndCases_relayQuery",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "score",
        "type": "String",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "caseCount_filters",
        "type": "FiltersArgument",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "gene_filters",
        "type": "FiltersArgument",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "GenesAndCases_relayQuery",
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
            "concreteType": "Explore",
            "name": "explore",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "ExploreCases",
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
                        "variableName": "caseCount_filters",
                        "type": "FiltersArgument"
                      },
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 0,
                        "type": "Int"
                      }
                    ],
                    "concreteType": "ECaseConnection",
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
                  }
                ],
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "Genes",
                "name": "genes",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "filters",
                        "variableName": "gene_filters",
                        "type": "FiltersArgument"
                      },
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 20,
                        "type": "Int"
                      },
                      {
                        "kind": "Variable",
                        "name": "score",
                        "variableName": "score",
                        "type": "String"
                      }
                    ],
                    "concreteType": "GeneConnection",
                    "name": "hits",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "total",
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "args": null,
                        "concreteType": "GeneEdge",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "args": null,
                            "concreteType": "Gene",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "score",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "symbol",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "gene_id",
                                "storageKey": null
                              },
                              {
                                "kind": "LinkedField",
                                "alias": "filteredCases",
                                "args": null,
                                "concreteType": "GeneCases",
                                "name": "case",
                                "plural": false,
                                "selections": [
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "args": [
                                      {
                                        "kind": "Variable",
                                        "name": "filters",
                                        "variableName": "gene_filters",
                                        "type": "FiltersArgument"
                                      },
                                      {
                                        "kind": "Literal",
                                        "name": "first",
                                        "value": 0,
                                        "type": "Int"
                                      }
                                    ],
                                    "concreteType": "GeneCaseConnection",
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
                                  }
                                ],
                                "storageKey": null
                              },
                              {
                                "kind": "LinkedField",
                                "alias": "allCases",
                                "args": null,
                                "concreteType": "GeneCases",
                                "name": "case",
                                "plural": false,
                                "selections": [
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "args": [
                                      {
                                        "kind": "Literal",
                                        "name": "first",
                                        "value": 0,
                                        "type": "Int"
                                      }
                                    ],
                                    "concreteType": "GeneCaseConnection",
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
                                    "storageKey": "hits{\"first\":0}"
                                  }
                                ],
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "id",
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
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "query GenesAndCases_relayQuery(\n  $score: String\n  $caseCount_filters: FiltersArgument\n  $gene_filters: FiltersArgument\n) {\n  viewer {\n    explore {\n      cases {\n        hits(first: 0, filters: $caseCount_filters) {\n          total\n        }\n      }\n      genes {\n        hits(first: 20, filters: $gene_filters, score: $score) {\n          total\n          edges {\n            node {\n              score\n              symbol\n              gene_id\n              filteredCases: case {\n                hits(first: 0, filters: $gene_filters) {\n                  total\n                }\n              }\n              allCases: case {\n                hits(first: 0) {\n                  total\n                }\n              }\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
};

module.exports = batch;
