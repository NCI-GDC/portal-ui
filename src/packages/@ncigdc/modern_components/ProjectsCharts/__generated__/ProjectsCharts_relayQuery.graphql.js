/**
 * @flow
 * @relayHash 1295aac15d7a19562fd0bbd231256122
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type ProjectsCharts_relayQueryResponse = {|
  +projectsViewer: ?{|
    +projects: ?{|
      +hits: ?{|
        +total: number;
        +edges: ?$ReadOnlyArray<?{|
          +node: ?{|
            +id: string;
            +project_id: ?string;
            +name: ?string;
            +disease_type: ?$ReadOnlyArray<?string>;
            +program: ?{|
              +name: ?string;
            |};
            +primary_site: ?$ReadOnlyArray<?string>;
            +summary: ?{|
              +case_count: ?number;
              +data_categories: ?$ReadOnlyArray<?{|
                +case_count: ?number;
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
*/


/*
query ProjectsCharts_relayQuery(
  $size: Int
  $offset: Int
  $projects_sort: [Sort]
  $filters: FiltersArgument
) {
  projectsViewer: viewer {
    projects {
      hits(first: $size, offset: $offset, sort: $projects_sort, filters: $filters) {
        total
        edges {
          node {
            id
            project_id
            name
            disease_type
            program {
              name
            }
            primary_site
            summary {
              case_count
              data_categories {
                case_count
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
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "size",
        "type": "Int",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "offset",
        "type": "Int",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "projects_sort",
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
    "name": "ProjectsCharts_relayQuery",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "projectsViewer",
        "args": null,
        "concreteType": "Root",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Projects",
            "name": "projects",
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
                    "variableName": "size",
                    "type": "Int"
                  },
                  {
                    "kind": "Variable",
                    "name": "offset",
                    "variableName": "offset",
                    "type": "Int"
                  },
                  {
                    "kind": "Variable",
                    "name": "sort",
                    "variableName": "projects_sort",
                    "type": "[Sort]"
                  }
                ],
                "concreteType": "ProjectConnection",
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
                    "concreteType": "ProjectEdge",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "args": null,
                        "concreteType": "Project",
                        "name": "node",
                        "plural": false,
                        "selections": [
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
                            "name": "project_id",
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "args": null,
                            "name": "name",
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
                            "name": "primary_site",
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
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "case_count",
                                "storageKey": null
                              },
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
                                    "name": "case_count",
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
    "type": "Root"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "ProjectsCharts_relayQuery",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "size",
        "type": "Int",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "offset",
        "type": "Int",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "projects_sort",
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
    "name": "ProjectsCharts_relayQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "projectsViewer",
        "args": null,
        "concreteType": "Root",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Projects",
            "name": "projects",
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
                    "variableName": "size",
                    "type": "Int"
                  },
                  {
                    "kind": "Variable",
                    "name": "offset",
                    "variableName": "offset",
                    "type": "Int"
                  },
                  {
                    "kind": "Variable",
                    "name": "sort",
                    "variableName": "projects_sort",
                    "type": "[Sort]"
                  }
                ],
                "concreteType": "ProjectConnection",
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
                    "concreteType": "ProjectEdge",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "args": null,
                        "concreteType": "Project",
                        "name": "node",
                        "plural": false,
                        "selections": [
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
                            "name": "project_id",
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "args": null,
                            "name": "name",
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
                            "name": "primary_site",
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
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "case_count",
                                "storageKey": null
                              },
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
                                    "name": "case_count",
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
    ]
  },
  "text": "query ProjectsCharts_relayQuery(\n  $size: Int\n  $offset: Int\n  $projects_sort: [Sort]\n  $filters: FiltersArgument\n) {\n  projectsViewer: viewer {\n    projects {\n      hits(first: $size, offset: $offset, sort: $projects_sort, filters: $filters) {\n        total\n        edges {\n          node {\n            id\n            project_id\n            name\n            disease_type\n            program {\n              name\n            }\n            primary_site\n            summary {\n              case_count\n              data_categories {\n                case_count\n                data_category\n              }\n              file_count\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
};

module.exports = batch;
