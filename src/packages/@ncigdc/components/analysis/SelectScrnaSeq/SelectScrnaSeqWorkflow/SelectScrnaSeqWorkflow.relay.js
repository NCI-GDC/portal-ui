import React from 'react';
import { graphql } from 'react-relay';
import { compose, pure, setDisplayName, withPropsOnChange } from 'recompose';

import Query from '@ncigdc/modern_components/Query';

// NOTES
// update filters and variables with real scrnaseq settings

const variables = {
  "files_size": 2,
  "files_offset": 0,
  "files_sort": [],
};

export default (Component) =>
  compose(
    setDisplayName('SelectScrnaSeqWorkflowQuery'),
    withPropsOnChange(['selectedCase'], ({ selectedCase }) => ({
      filters: {
        content: [
          {
            op: "in",
            content: {
              field: "cases.case_id",
              value: [
                selectedCase
              ]
            }
          },
        {
          op: "in",
          content: {
            field: "files.analysis.workflow_type",
            value: [
              "MuSE",
              "VarScan2"
            ]
          }
        },
          {
            op: "in",
            content: {
              field: "files.data_format",
              value: [
                "vcf"
              ]
            }
          }
        ],
        op: "and"
      }
    })),
    pure,
  )((props) => {
    const { filters } = props;
    return (
      <Query
        parentProps={props}
        name="SelectScrnaSeqWorkflow"
        minHeight={0}
        variables={{ ...variables, filters }}
        Component={Component}
        query={graphql`
          query SelectScrnaSeqWorkflow_relayQuery(
            $files_size: Int
            $files_offset: Int
            $files_sort: [Sort]
            $filters: FiltersArgument
          ) {
            viewer {
              repository {
                files {
                  hits(first: $files_size, offset: $files_offset, sort: $files_sort, filters: $filters) {
                    edges {
                      node {
                        file_id
                        analysis {
                          workflow_type
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `}
      />
    );
  });
