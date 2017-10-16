/**
 * @flow
 * @relayHash 4ae0e3d6d98c581310e1443bd946934a
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type mutationsAppendExploreCaseSetMutationVariables = {|
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

export type mutationsAppendExploreCaseSetMutationResponse = {|
  +sets: ?{|
    +append: ?{|
      +explore: ?{|
        +case: ?{|
          +set_id: ?string;
        |};
      |};
    |};
  |};
|};
*/


/*
mutation mutationsAppendExploreCaseSetMutation(
  $input: AppendSetInput
  $never_used: RelayIsDumb
) {
  sets(input: $never_used) {
    append {
      explore {
        case(input: $input) {
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
    "name": "mutationsAppendExploreCaseSetMutation",
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
                    "concreteType": "AppendCaseSet",
                    "name": "case",
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
  "name": "mutationsAppendExploreCaseSetMutation",
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
    "name": "mutationsAppendExploreCaseSetMutation",
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
                    "concreteType": "AppendCaseSet",
                    "name": "case",
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
  "text": "mutation mutationsAppendExploreCaseSetMutation(\n  $input: AppendSetInput\n  $never_used: RelayIsDumb\n) {\n  sets(input: $never_used) {\n    append {\n      explore {\n        case(input: $input) {\n          set_id\n        }\n      }\n    }\n  }\n}\n"
};

module.exports = batch;
