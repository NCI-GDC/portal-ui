/**
 * @flow
 * @relayHash de1eaf269b365c1205128befb964fe88
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type FilesTable_relayQueryResponse = {|
  +viewer: ?{|
    +repository: ?{|
      +files: ?{|
        +hits: ?{|
          +total: number;
          +edges: ?$ReadOnlyArray<?{|
            +node: ?{|
              +id: string;
              +file_id: ?string;
              +file_name: ?string;
              +file_size: ?number;
              +access: ?string;
              +file_state: ?string;
              +state: ?string;
              +acl: ?$ReadOnlyArray<?string>;
              +data_category: ?string;
              +data_format: ?string;
              +platform: ?string;
              +data_type: ?string;
              +experimental_strategy: ?string;
              +cases: ?{|
                +hits: ?{|
                  +total: number;
                  +edges: ?$ReadOnlyArray<?{|
                    +node: ?{|
                      +case_id: ?string;
                      +project: ?{|
                        +project_id: ?string;
                      |};
                    |};
                  |}>;
                |};
              |};
              +annotations: ?{|
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
query FilesTable_relayQuery(
  $files_size: Int
  $files_offset: Int
  $files_sort: [Sort]
  $filters: FiltersArgument
) {
  viewer {
    repository {
      files {
        hits(first: $files_size, offset: $files_offset, sort: $files_sort, filters: $filters) {
          total
          edges {
            node {
              acl
              id
              file_name
              file_size
              access
              file_state
              state
              file_id
              data_category
              data_format
              platform
              data_type
              experimental_strategy
              cases {
                hits(first: 1) {
                  total
                  edges {
                    node {
                      case_id
                      project {
                        project_id
                        id
                      }
                      id
                    }
                  }
                }
              }
              annotations {
                hits(first: 0) {
                  total
                }
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
        "name": "files_size",
        "type": "Int",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "files_offset",
        "type": "Int",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "files_sort",
        "type": "[Sort]",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "filters",
        "type": "FiltersArgument",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "FilesTable_relayQuery",
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
                "alias": null,
                "args": null,
                "concreteType": "Files",
                "name": "files",
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
                        "variableName": "files_size",
                        "type": "Int"
                      },
                      {
                        "kind": "Variable",
                        "name": "offset",
                        "variableName": "files_offset",
                        "type": "Int"
                      },
                      {
                        "kind": "Variable",
                        "name": "sort",
                        "variableName": "files_sort",
                        "type": "[Sort]"
                      }
                    ],
                    "concreteType": "FileConnection",
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
                        "concreteType": "FileEdge",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "args": null,
                            "concreteType": "File",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "acl",
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
                                "name": "file_name",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "file_size",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "access",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "file_state",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "state",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "file_id",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "data_category",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "data_format",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "platform",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "data_type",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "experimental_strategy",
                                "storageKey": null
                              },
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "args": null,
                                "concreteType": "FileCases",
                                "name": "cases",
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
                                    "concreteType": "FileCaseConnection",
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
                                        "concreteType": "FileCaseEdge",
                                        "name": "edges",
                                        "plural": true,
                                        "selections": [
                                          {
                                            "kind": "LinkedField",
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "FileCase",
                                            "name": "node",
                                            "plural": false,
                                            "selections": [
                                              {
                                                "kind": "ScalarField",
                                                "alias": null,
                                                "args": null,
                                                "name": "case_id",
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
                                    "storageKey": "hits{\"first\":1}"
                                  }
                                ],
                                "storageKey": null
                              },
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "args": null,
                                "concreteType": "FileAnnotations",
                                "name": "annotations",
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
                                    "concreteType": "FileAnnotationConnection",
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
  "name": "FilesTable_relayQuery",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "files_size",
        "type": "Int",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "files_offset",
        "type": "Int",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "files_sort",
        "type": "[Sort]",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "filters",
        "type": "FiltersArgument",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "FilesTable_relayQuery",
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
                "alias": null,
                "args": null,
                "concreteType": "Files",
                "name": "files",
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
                        "variableName": "files_size",
                        "type": "Int"
                      },
                      {
                        "kind": "Variable",
                        "name": "offset",
                        "variableName": "files_offset",
                        "type": "Int"
                      },
                      {
                        "kind": "Variable",
                        "name": "sort",
                        "variableName": "files_sort",
                        "type": "[Sort]"
                      }
                    ],
                    "concreteType": "FileConnection",
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
                        "concreteType": "FileEdge",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "args": null,
                            "concreteType": "File",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "file_id",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "acl",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "file_name",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "file_size",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "access",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "file_state",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "state",
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
                                "name": "data_category",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "data_format",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "platform",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "data_type",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "experimental_strategy",
                                "storageKey": null
                              },
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "args": null,
                                "concreteType": "FileCases",
                                "name": "cases",
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
                                    "concreteType": "FileCaseConnection",
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
                                        "concreteType": "FileCaseEdge",
                                        "name": "edges",
                                        "plural": true,
                                        "selections": [
                                          {
                                            "kind": "LinkedField",
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "FileCase",
                                            "name": "node",
                                            "plural": false,
                                            "selections": [
                                              {
                                                "kind": "ScalarField",
                                                "alias": null,
                                                "args": null,
                                                "name": "case_id",
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
                                "concreteType": "FileAnnotations",
                                "name": "annotations",
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
                                    "concreteType": "FileAnnotationConnection",
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
    ]
  },
  "text": "query FilesTable_relayQuery(\n  $files_size: Int\n  $files_offset: Int\n  $files_sort: [Sort]\n  $filters: FiltersArgument\n) {\n  viewer {\n    repository {\n      files {\n        hits(first: $files_size, offset: $files_offset, sort: $files_sort, filters: $filters) {\n          total\n          edges {\n            node {\n              acl\n              id\n              file_name\n              file_size\n              access\n              file_state\n              state\n              file_id\n              data_category\n              data_format\n              platform\n              data_type\n              experimental_strategy\n              cases {\n                hits(first: 1) {\n                  total\n                  edges {\n                    node {\n                      case_id\n                      project {\n                        project_id\n                        id\n                      }\n                      id\n                    }\n                  }\n                }\n              }\n              annotations {\n                hits(first: 0) {\n                  total\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
};

module.exports = batch;
