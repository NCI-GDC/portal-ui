/**
 * @flow
 * @relayHash 919a5d1903298365c63bc99e4951e5ec
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type mutationsRemoveFromExploreGeneSetMutationVariables = {|
  input?: ?{
    filters?: ?any;
    set_id?: ?string;
  };
  never_used?: ?{
    relay_is_dumb?: ?any;
  };
|};

export type mutationsRemoveFromExploreGeneSetMutationResponse = {|
  +sets: ?{|
    +remove_from: ?{|
      +explore: ?{|
        +gene: ?{|
          +set_id: ?string;
        |};
      |};
    |};
  |};
|};
*/


/*
mutation mutationsRemoveFromExploreGeneSetMutation(
  $input: RemoveFromSetInput
  $never_used: RelayIsDumb
) {
  sets(input: $never_used) {
    remove_from {
      explore {
        gene(input: $input) {
          set_id
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
        "name": "input",
        "type": "RemoveFromSetInput",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "never_used",
        "type": "RelayIsDumb",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "mutationsRemoveFromExploreGeneSetMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "never_used",
            "type": "RelayIsDumb"
          }
        ],
        "concreteType": "Sets",
        "name": "sets",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "RemoveFromSet",
            "name": "remove_from",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "RemoveFromExploreSet",
                "name": "explore",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "input",
                        "variableName": "input",
                        "type": "RemoveFromSetInput"
                      }
                    ],
                    "concreteType": "RemoveFromGeneSet",
                    "name": "gene",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "set_id",
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
    "type": "Mutation"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "mutationsRemoveFromExploreGeneSetMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "RemoveFromSetInput",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "never_used",
        "type": "RelayIsDumb",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "mutationsRemoveFromExploreGeneSetMutation",
    "operation": "mutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "never_used",
            "type": "RelayIsDumb"
          }
        ],
        "concreteType": "Sets",
        "name": "sets",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "RemoveFromSet",
            "name": "remove_from",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "RemoveFromExploreSet",
                "name": "explore",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "input",
                        "variableName": "input",
                        "type": "RemoveFromSetInput"
                      }
                    ],
                    "concreteType": "RemoveFromGeneSet",
                    "name": "gene",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "set_id",
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
  "text": "mutation mutationsRemoveFromExploreGeneSetMutation(\n  $input: RemoveFromSetInput\n  $never_used: RelayIsDumb\n) {\n  sets(input: $never_used) {\n    remove_from {\n      explore {\n        gene(input: $input) {\n          set_id\n        }\n      }\n    }\n  }\n}\n"
};

module.exports = batch;
