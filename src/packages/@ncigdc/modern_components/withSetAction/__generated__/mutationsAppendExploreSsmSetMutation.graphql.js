/**
 * @flow
 * @relayHash ad35170aca7a5f110cebddcca65ac239
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type mutationsAppendExploreSsmSetMutationVariables = {|
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

export type mutationsAppendExploreSsmSetMutationResponse = {|
  +sets: ?{|
    +append: ?{|
      +explore: ?{|
        +ssm: ?{|
          +set_id: ?string;
        |};
      |};
    |};
  |};
|};
*/


/*
mutation mutationsAppendExploreSsmSetMutation(
  $input: AppendSetInput
  $never_used: RelayIsDumb
) {
  sets(input: $never_used) {
    append {
      explore {
        ssm(input: $input) {
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
    "name": "mutationsAppendExploreSsmSetMutation",
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
                    "concreteType": "AppendSsmSet",
                    "name": "ssm",
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
  "name": "mutationsAppendExploreSsmSetMutation",
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
    "name": "mutationsAppendExploreSsmSetMutation",
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
                    "concreteType": "AppendSsmSet",
                    "name": "ssm",
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
  "text": "mutation mutationsAppendExploreSsmSetMutation(\n  $input: AppendSetInput\n  $never_used: RelayIsDumb\n) {\n  sets(input: $never_used) {\n    append {\n      explore {\n        ssm(input: $input) {\n          set_id\n        }\n      }\n    }\n  }\n}\n"
};

module.exports = batch;
