/**
 * @flow
 * @relayHash 9f13ac72be4bc34ea643d559cd0cbc94
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type Pvalue_relayQueryResponse = {|
  +analysis: ?{|
    +pvalue: ?number;
  |};
|};
*/


/*
query Pvalue_relayQuery(
  $data: [[Int]]!
) {
  analysis {
    pvalue(data: $data)
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "data",
        "type": "[[Int]]!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "Pvalue_relayQuery",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "Analysis",
        "name": "analysis",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "args": [
              {
                "kind": "Variable",
                "name": "data",
                "variableName": "data",
                "type": "[[Int]]!"
              }
            ],
            "name": "pvalue",
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
  "name": "Pvalue_relayQuery",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "data",
        "type": "[[Int]]!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "Pvalue_relayQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "Analysis",
        "name": "analysis",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "args": [
              {
                "kind": "Variable",
                "name": "data",
                "variableName": "data",
                "type": "[[Int]]!"
              }
            ],
            "name": "pvalue",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "query Pvalue_relayQuery(\n  $data: [[Int]]!\n) {\n  analysis {\n    pvalue(data: $data)\n  }\n}\n"
};

module.exports = batch;
