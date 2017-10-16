/**
 * @flow
 * @relayHash 42ca90b2e5d1b3ed55d1fef8e52a73ff
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type TopCasesCountByGenes_relayQueryResponse = {|
  +analysisViewer: ?{|
    +analysis: ?{|
      +top_cases_count_by_genes: ?{|
        +data: ?any;
      |};
    |};
  |};
|};
*/


/*
query TopCasesCountByGenes_relayQuery(
  $first: Int
  $geneIds: [String]
  $filters: FiltersArgument
) {
  analysisViewer: viewer {
    analysis {
      top_cases_count_by_genes {
        data(first: $first, gene_ids: $geneIds, filters: $filters)
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
        "name": "first",
        "type": "Int",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "geneIds",
        "type": "[String]",
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
    "name": "TopCasesCountByGenes_relayQuery",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "analysisViewer",
        "args": null,
        "concreteType": "Root",
        "name": "viewer",
        "plural": false,
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
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "TopCasesCountByGenes",
                "name": "top_cases_count_by_genes",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
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
                        "variableName": "first",
                        "type": "Int"
                      },
                      {
                        "kind": "Variable",
                        "name": "gene_ids",
                        "variableName": "geneIds",
                        "type": "[String]"
                      }
                    ],
                    "name": "data",
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
  "name": "TopCasesCountByGenes_relayQuery",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "first",
        "type": "Int",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "geneIds",
        "type": "[String]",
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
    "name": "TopCasesCountByGenes_relayQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "analysisViewer",
        "args": null,
        "concreteType": "Root",
        "name": "viewer",
        "plural": false,
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
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "TopCasesCountByGenes",
                "name": "top_cases_count_by_genes",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
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
                        "variableName": "first",
                        "type": "Int"
                      },
                      {
                        "kind": "Variable",
                        "name": "gene_ids",
                        "variableName": "geneIds",
                        "type": "[String]"
                      }
                    ],
                    "name": "data",
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
  "text": "query TopCasesCountByGenes_relayQuery(\n  $first: Int\n  $geneIds: [String]\n  $filters: FiltersArgument\n) {\n  analysisViewer: viewer {\n    analysis {\n      top_cases_count_by_genes {\n        data(first: $first, gene_ids: $geneIds, filters: $filters)\n      }\n    }\n  }\n}\n"
};

module.exports = batch;
