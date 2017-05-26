/**
 * This file was generated by:
 *   relay-compiler
 *
 * @providesModule ProjectTable_projects.graphql
 * @generated SignedSource<<000d08b7054cfcb93b85007412457e0c>>
 * @flow
 * @nogrep
 */

"use strict";

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type ProjectTable_projects = {
  total: number;
  edges?: ?Array<?ProjectTable_projects_edges>;
};

export type ProjectTable_projects_edges_node_program = {
  name?: ?string;
};

export type ProjectTable_projects_edges_node_summary_data_categories = {
  case_count?: ?number;
  data_category?: ?string;
};

export type ProjectTable_projects_edges_node_summary = {
  case_count?: ?number;
  data_categories?: ?Array<?ProjectTable_projects_edges_node_summary_data_categories>;
  file_count?: ?number;
};

export type ProjectTable_projects_edges_node = {
  id: string;
  project_id?: ?string;
  disease_type?: ?Array<?string>;
  program?: ?ProjectTable_projects_edges_node_program;
  primary_site?: ?Array<?string>;
  summary?: ?ProjectTable_projects_edges_node_summary;
};

export type ProjectTable_projects_edges = {
  node?: ?ProjectTable_projects_edges_node;
};
*/

/* eslint-disable comma-dangle, quotes */

const fragment /*: ConcreteFragment*/ = {
  argumentDefinitions: [],
  kind: "Fragment",
  metadata: null,
  name: "ProjectTable_projects",
  selections: [
    {
      kind: "ScalarField",
      alias: null,
      args: null,
      name: "total",
      storageKey: null
    },
    {
      kind: "LinkedField",
      alias: null,
      args: null,
      concreteType: "ProjectEdge",
      name: "edges",
      plural: true,
      selections: [
        {
          kind: "LinkedField",
          alias: null,
          args: null,
          concreteType: "Project",
          name: "node",
          plural: false,
          selections: [
            {
              kind: "ScalarField",
              alias: null,
              args: null,
              name: "id",
              storageKey: null
            },
            {
              kind: "ScalarField",
              alias: null,
              args: null,
              name: "project_id",
              storageKey: null
            },
            {
              kind: "ScalarField",
              alias: null,
              args: null,
              name: "disease_type",
              storageKey: null
            },
            {
              kind: "LinkedField",
              alias: null,
              args: null,
              concreteType: "Program",
              name: "program",
              plural: false,
              selections: [
                {
                  kind: "ScalarField",
                  alias: null,
                  args: null,
                  name: "name",
                  storageKey: null
                }
              ],
              storageKey: null
            },
            {
              kind: "ScalarField",
              alias: null,
              args: null,
              name: "primary_site",
              storageKey: null
            },
            {
              kind: "LinkedField",
              alias: null,
              args: null,
              concreteType: "Summary",
              name: "summary",
              plural: false,
              selections: [
                {
                  kind: "ScalarField",
                  alias: null,
                  args: null,
                  name: "case_count",
                  storageKey: null
                },
                {
                  kind: "LinkedField",
                  alias: null,
                  args: null,
                  concreteType: "DataCategories",
                  name: "data_categories",
                  plural: true,
                  selections: [
                    {
                      kind: "ScalarField",
                      alias: null,
                      args: null,
                      name: "case_count",
                      storageKey: null
                    },
                    {
                      kind: "ScalarField",
                      alias: null,
                      args: null,
                      name: "data_category",
                      storageKey: null
                    }
                  ],
                  storageKey: null
                },
                {
                  kind: "ScalarField",
                  alias: null,
                  args: null,
                  name: "file_count",
                  storageKey: null
                }
              ],
              storageKey: null
            }
          ],
          storageKey: null
        }
      ],
      storageKey: null
    }
  ],
  type: "ProjectConnection"
};

module.exports = fragment;
