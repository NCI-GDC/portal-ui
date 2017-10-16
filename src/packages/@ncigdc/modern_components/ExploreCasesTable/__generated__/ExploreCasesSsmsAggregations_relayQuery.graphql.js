/**
 * @flow
 * @relayHash 2ab88f6e496659f5cbdfefb49f24e433
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type ExploreCasesSsmsAggregations_relayQueryResponse = {|
  +ssmsAggregationsViewer: ?{|
    +explore: ?{|
      +ssms: ?{|
        +aggregations: ?{|
          +occurrence__case__case_id: ?{|
            +buckets: ?$ReadOnlyArray<?{|
              +key: ?string;
              +doc_count: ?number;
            |}>;
          |};
        |};
      |};
    |};
  |};
|};
*/


/*
query ExploreCasesSsmsAggregations_relayQuery(
  $ssmCountsfilters: FiltersArgument
) {
  ssmsAggregationsViewer: viewer {
    explore {
      ssms {
        aggregations(filters: $ssmCountsfilters, aggregations_filter_themselves: true) {
          occurrence__case__case_id {
            buckets {
              key
              doc_count
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
        "name": "ssmCountsfilters",
        "type": "FiltersArgument",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ExploreCasesSsmsAggregations_relayQuery",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "ssmsAggregationsViewer",
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
                "concreteType": "Ssms",
                "name": "ssms",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "aggregations_filter_themselves",
                        "value": true,
                        "type": "Boolean"
                      },
                      {
                        "kind": "Variable",
                        "name": "filters",
                        "variableName": "ssmCountsfilters",
                        "type": "FiltersArgument"
                      }
                    ],
                    "concreteType": "SsmAggregations",
                    "name": "aggregations",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "args": null,
                        "concreteType": "Aggregations",
                        "name": "occurrence__case__case_id",
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
                                "name": "key",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "doc_count",
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
  "name": "ExploreCasesSsmsAggregations_relayQuery",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "ssmCountsfilters",
        "type": "FiltersArgument",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "ExploreCasesSsmsAggregations_relayQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "ssmsAggregationsViewer",
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
                "concreteType": "Ssms",
                "name": "ssms",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "aggregations_filter_themselves",
                        "value": true,
                        "type": "Boolean"
                      },
                      {
                        "kind": "Variable",
                        "name": "filters",
                        "variableName": "ssmCountsfilters",
                        "type": "FiltersArgument"
                      }
                    ],
                    "concreteType": "SsmAggregations",
                    "name": "aggregations",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "args": null,
                        "concreteType": "Aggregations",
                        "name": "occurrence__case__case_id",
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
                                "name": "key",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "doc_count",
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
  "text": "query ExploreCasesSsmsAggregations_relayQuery(\n  $ssmCountsfilters: FiltersArgument\n) {\n  ssmsAggregationsViewer: viewer {\n    explore {\n      ssms {\n        aggregations(filters: $ssmCountsfilters, aggregations_filter_themselves: true) {\n          occurrence__case__case_id {\n            buckets {\n              key\n              doc_count\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
};

module.exports = batch;
