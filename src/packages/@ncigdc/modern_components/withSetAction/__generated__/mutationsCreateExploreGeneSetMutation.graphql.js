/**
 * @flow
 * @relayHash bc97df5cd237a69cac17c00e850b1443
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type mutationsCreateExploreGeneSetMutationVariables = {|
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

export type mutationsCreateExploreGeneSetMutationResponse = {|
  +sets: ?{|
    +create: ?{|
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
mutation mutationsCreateExploreGeneSetMutation(
  $input: CreateSetInput
  $never_used: RelayIsDumb
) {
  sets(input: $never_used) {
    create {
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
        "type": "CreateSetInput",
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
    "name": "mutationsCreateExploreGeneSetMutation",
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
            "concreteType": "CreateSet",
            "name": "create",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "CreateExploreSet",
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
                        "type": "CreateSetInput"
                      }
                    ],
                    "concreteType": "CreateGeneSet",
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
  "name": "mutationsCreateExploreGeneSetMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "CreateSetInput",
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
    "name": "mutationsCreateExploreGeneSetMutation",
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
            "concreteType": "CreateSet",
            "name": "create",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "CreateExploreSet",
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
                        "type": "CreateSetInput"
                      }
                    ],
                    "concreteType": "CreateGeneSet",
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
  "text": "mutation mutationsCreateExploreGeneSetMutation(\n  $input: CreateSetInput\n  $never_used: RelayIsDumb\n) {\n  sets(input: $never_used) {\n    create {\n      explore {\n        gene(input: $input) {\n          set_id\n        }\n      }\n    }\n  }\n}\n"
};

module.exports = batch;
