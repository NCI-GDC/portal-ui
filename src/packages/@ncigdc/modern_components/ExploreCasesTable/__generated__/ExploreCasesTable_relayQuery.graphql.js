/**
 * @flow
 * @relayHash 8c7a3f209a5248301555bc45acbf87e3
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type ExploreCasesTable_relayQueryResponse = {|
  +exploreCasesTableViewer: ?{|
    +explore: ?{|
      +cases: ?{|
        +hits: ?{|
          +total: number;
          +edges: ?$ReadOnlyArray<?{|
            +node: ?{|
              +score: ?number;
              +id: string;
              +case_id: ?string;
              +primary_site: ?string;
              +disease_type: ?string;
              +submitter_id: ?string;
              +project: ?{|
                +project_id: ?string;
                +program: ?{|
                  +name: ?string;
                |};
              |};
              +diagnoses: ?{|
                +hits: ?{|
                  +edges: ?$ReadOnlyArray<?{|
                    +node: ?{|
                      +primary_diagnosis: ?string;
                      +age_at_diagnosis: ?number;
                      +vital_status: ?string;
                      +days_to_death: ?number;
                    |};
                  |}>;
                |};
              |};
              +demographic: ?{|
                +gender: ?string;
                +ethnicity: ?string;
                +race: ?string;
              |};
              +summary: ?{|
                +data_categories: ?$ReadOnlyArray<?{|
                  +file_count: ?number;
                  +data_category: ?string;
                |}>;
                +file_count: ?number;
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
query ExploreCasesTable_relayQuery(
  $filters: FiltersArgument
  $cases_size: Int
  $cases_offset: Int
  $cases_score: String
  $cases_sort: [Sort]
) {
  exploreCasesTableViewer: viewer {
    explore {
      cases {
        hits(first: $cases_size, offset: $cases_offset, filters: $filters, score: $cases_score, sort: $cases_sort) {
          total
          edges {
            node {
              score
              id
              case_id
              primary_site
              disease_type
              submitter_id
              project {
                project_id
                program {
                  name
                }
                id
              }
              diagnoses {
                hits(first: 1) {
                  edges {
                    node {
                      primary_diagnosis
                      age_at_diagnosis
                      vital_status
                      days_to_death
                      id
                    }
                  }
                }
              }
              demographic {
                gender
                ethnicity
                race
              }
              summary {
                data_categories {
                  file_count
                  data_category
                }
                file_count
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
        "name": "filters",
        "type": "FiltersArgument",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "cases_size",
        "type": "Int",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "cases_offset",
        "type": "Int",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "cases_score",
        "type": "String",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "cases_sort",
        "type": "[Sort]",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ExploreCasesTable_relayQuery",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "exploreCasesTableViewer",
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
                        "variableName": "filters",
                        "type": "FiltersArgument"
                      },
                      {
                        "kind": "Variable",
                        "name": "first",
                        "variableName": "cases_size",
                        "type": "Int"
                      },
                      {
                        "kind": "Variable",
                        "name": "offset",
                        "variableName": "cases_offset",
                        "type": "Int"
                      },
                      {
                        "kind": "Variable",
                        "name": "score",
                        "variableName": "cases_score",
                        "type": "String"
                      },
                      {
                        "kind": "Variable",
                        "name": "sort",
                        "variableName": "cases_sort",
                        "type": "[Sort]"
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
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "args": null,
                        "concreteType": "ECaseEdge",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "args": null,
                            "concreteType": "ECase",
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
                                "name": "id",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "case_id",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "primary_site",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "disease_type",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "submitter_id",
                                "storageKey": null
                              },
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "args": null,
                                "concreteType": "Project",
                                "name": "project",
                                "plural": false,
                                "selections": [
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "project_id",
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Program",
                                    "name": "program",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "args": null,
                                        "name": "name",
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
                                "concreteType": "EDiagnoses",
                                "name": "diagnoses",
                                "plural": false,
                                "selections": [
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "args": [
                                      {
                                        "kind": "Literal",
                                        "name": "first",
                                        "value": 1,
                                        "type": "Int"
                                      }
                                    ],
                                    "concreteType": "EDiagnosisConnection",
                                    "name": "hits",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "kind": "LinkedField",
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "EDiagnosisEdge",
                                        "name": "edges",
                                        "plural": true,
                                        "selections": [
                                          {
                                            "kind": "LinkedField",
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "EDiagnosis",
                                            "name": "node",
                                            "plural": false,
                                            "selections": [
                                              {
                                                "kind": "ScalarField",
                                                "alias": null,
                                                "args": null,
                                                "name": "primary_diagnosis",
                                                "storageKey": null
                                              },
                                              {
                                                "kind": "ScalarField",
                                                "alias": null,
                                                "args": null,
                                                "name": "age_at_diagnosis",
                                                "storageKey": null
                                              },
                                              {
                                                "kind": "ScalarField",
                                                "alias": null,
                                                "args": null,
                                                "name": "vital_status",
                                                "storageKey": null
                                              },
                                              {
                                                "kind": "ScalarField",
                                                "alias": null,
                                                "args": null,
                                                "name": "days_to_death",
                                                "storageKey": null
                                              }
                                            ],
                                            "storageKey": null
                                          }
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": "hits{\"first\":1}"
                                  }
                                ],
                                "storageKey": null
                              },
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "args": null,
                                "concreteType": "EDemographic",
                                "name": "demographic",
                                "plural": false,
                                "selections": [
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "gender",
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "ethnicity",
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "race",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "args": null,
                                "concreteType": "Summary",
                                "name": "summary",
                                "plural": false,
                                "selections": [
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "DataCategories",
                                    "name": "data_categories",
                                    "plural": true,
                                    "selections": [
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "args": null,
                                        "name": "file_count",
                                        "storageKey": null
                                      },
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "args": null,
                                        "name": "data_category",
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "file_count",
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
        "storageKey": null
      }
    ],
    "type": "Root"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "ExploreCasesTable_relayQuery",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "filters",
        "type": "FiltersArgument",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "cases_size",
        "type": "Int",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "cases_offset",
        "type": "Int",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "cases_score",
        "type": "String",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "cases_sort",
        "type": "[Sort]",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "ExploreCasesTable_relayQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "exploreCasesTableViewer",
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
                        "variableName": "filters",
                        "type": "FiltersArgument"
                      },
                      {
                        "kind": "Variable",
                        "name": "first",
                        "variableName": "cases_size",
                        "type": "Int"
                      },
                      {
                        "kind": "Variable",
                        "name": "offset",
                        "variableName": "cases_offset",
                        "type": "Int"
                      },
                      {
                        "kind": "Variable",
                        "name": "score",
                        "variableName": "cases_score",
                        "type": "String"
                      },
                      {
                        "kind": "Variable",
                        "name": "sort",
                        "variableName": "cases_sort",
                        "type": "[Sort]"
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
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "args": null,
                        "concreteType": "ECaseEdge",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "args": null,
                            "concreteType": "ECase",
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
                                "name": "id",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "case_id",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "primary_site",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "disease_type",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "submitter_id",
                                "storageKey": null
                              },
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "args": null,
                                "concreteType": "Project",
                                "name": "project",
                                "plural": false,
                                "selections": [
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "project_id",
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Program",
                                    "name": "program",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "args": null,
                                        "name": "name",
                                        "storageKey": null
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
                              },
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "args": null,
                                "concreteType": "EDiagnoses",
                                "name": "diagnoses",
                                "plural": false,
                                "selections": [
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "args": [
                                      {
                                        "kind": "Literal",
                                        "name": "first",
                                        "value": 1,
                                        "type": "Int"
                                      }
                                    ],
                                    "concreteType": "EDiagnosisConnection",
                                    "name": "hits",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "kind": "LinkedField",
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "EDiagnosisEdge",
                                        "name": "edges",
                                        "plural": true,
                                        "selections": [
                                          {
                                            "kind": "LinkedField",
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "EDiagnosis",
                                            "name": "node",
                                            "plural": false,
                                            "selections": [
                                              {
                                                "kind": "ScalarField",
                                                "alias": null,
                                                "args": null,
                                                "name": "primary_diagnosis",
                                                "storageKey": null
                                              },
                                              {
                                                "kind": "ScalarField",
                                                "alias": null,
                                                "args": null,
                                                "name": "age_at_diagnosis",
                                                "storageKey": null
                                              },
                                              {
                                                "kind": "ScalarField",
                                                "alias": null,
                                                "args": null,
                                                "name": "vital_status",
                                                "storageKey": null
                                              },
                                              {
                                                "kind": "ScalarField",
                                                "alias": null,
                                                "args": null,
                                                "name": "days_to_death",
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
                                    "storageKey": "hits{\"first\":1}"
                                  }
                                ],
                                "storageKey": null
                              },
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "args": null,
                                "concreteType": "EDemographic",
                                "name": "demographic",
                                "plural": false,
                                "selections": [
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "gender",
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "ethnicity",
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "race",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "args": null,
                                "concreteType": "Summary",
                                "name": "summary",
                                "plural": false,
                                "selections": [
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "DataCategories",
                                    "name": "data_categories",
                                    "plural": true,
                                    "selections": [
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "args": null,
                                        "name": "file_count",
                                        "storageKey": null
                                      },
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "args": null,
                                        "name": "data_category",
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "file_count",
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
        "storageKey": null
      }
    ]
  },
  "text": "query ExploreCasesTable_relayQuery(\n  $filters: FiltersArgument\n  $cases_size: Int\n  $cases_offset: Int\n  $cases_score: String\n  $cases_sort: [Sort]\n) {\n  exploreCasesTableViewer: viewer {\n    explore {\n      cases {\n        hits(first: $cases_size, offset: $cases_offset, filters: $filters, score: $cases_score, sort: $cases_sort) {\n          total\n          edges {\n            node {\n              score\n              id\n              case_id\n              primary_site\n              disease_type\n              submitter_id\n              project {\n                project_id\n                program {\n                  name\n                }\n                id\n              }\n              diagnoses {\n                hits(first: 1) {\n                  edges {\n                    node {\n                      primary_diagnosis\n                      age_at_diagnosis\n                      vital_status\n                      days_to_death\n                      id\n                    }\n                  }\n                }\n              }\n              demographic {\n                gender\n                ethnicity\n                race\n              }\n              summary {\n                data_categories {\n                  file_count\n                  data_category\n                }\n                file_count\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
};

module.exports = batch;
