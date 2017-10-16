/**
 * @flow
 * @relayHash 4827ce694d490f0c94b42a441c61307b
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type mutationsAppendExploreGeneSetMutationVariables = {|
  input?: ?{
    filters?: ?any;
    size?: ?number;
    sort?: ?$ReadOnlyArray<?{
      field: string;
      order?: ?"asc" | "desc";
      mode?: ?"avg" | "max" | "min" | "sum";
      missing?: ?"first" | "last";
    }>;
    score?: ?string;
    set_id?: ?string;
  };
  never_used?: ?{
    relay_is_dumb?: ?any;
  };
|};

export type mutationsAppendExploreGeneSetMutationResponse = {|
  +sets: ?{|
    +append: ?{|
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
mutation mutationsAppendExploreGeneSetMutation(
  $input: AppendSetInput
  $never_used: RelayIsDumb
) {
  sets(input: $never_used) {
    append {
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
        "type": "AppendSetInput",
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
    "name": "mutationsAppendExploreGeneSetMutation",
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
            "concreteType": "AppendSet",
            "name": "append",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "AppendExploreSet",
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
                        "type": "AppendSetInput"
                      }
                    ],
                    "concreteType": "AppendGeneSet",
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
  "name": "mutationsAppendExploreGeneSetMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "AppendSetInput",
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
    "name": "mutationsAppendExploreGeneSetMutation",
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
            "concreteType": "AppendSet",
            "name": "append",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "AppendExploreSet",
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
                        "type": "AppendSetInput"
                      }
                    ],
                    "concreteType": "AppendGeneSet",
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
  "text": "mutation mutationsAppendExploreGeneSetMutation(\n  $input: AppendSetInput\n  $never_used: RelayIsDumb\n) {\n  sets(input: $never_used) {\n    append {\n      explore {\n        gene(input: $input) {\n          set_id\n        }\n      }\n    }\n  }\n}\n"
};

module.exports = batch;
