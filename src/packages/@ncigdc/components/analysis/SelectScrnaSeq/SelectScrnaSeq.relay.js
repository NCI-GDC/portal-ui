import React from 'react';
import { graphql } from 'react-relay';
import { compose, pure, setDisplayName } from 'recompose';

import Query from '@ncigdc/modern_components/Query';

export const scrnaSeqFilters = {
  content: [
    {
      op: "in",
      content: {
        field: "files.analysis.workflow_type",
        value: [
          "Seurat - 10x Chromium",
          "Seurat - Smart-Seq2"
        ]
      }
    },
    {
      op: "in",
      content: {
        field: "files.data_format",
        value: [
          "tsv"
        ]
      }
    }
  ],
  op: "and",
};

const variables = {
  cases_offset: 0,
  cases_size: 99,
  cases_sort: [],
  filters: scrnaSeqFilters,
  score: 'annotations.annotation_id',
};

export default (Component) =>
  compose(
    setDisplayName('SelectScrnaSeqQuery'),
    pure,
  )((props) => {
    return (
      <Query
        parentProps={props}
        name="SelectScrnaSeqCases"
        minHeight={387}
        variables={variables}
        Component={Component}
        query={graphql`
          query SelectScrnaSeq_relayQuery(
            $cases_size: Int
            $cases_offset: Int
            $cases_sort: [Sort]
            $filters: FiltersArgument
            $score: String
          ) {
            viewer {
              repository {
                cases {
                  hits(score: $score, first: $cases_size, offset: $cases_offset, sort: $cases_sort, filters: $filters) {
                    edges {
                      node {
                        case_id
                        demographic {
                          gender
                        }
                        disease_type
                        primary_site
                        project {
                          project_id
                        }
                        submitter_id
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
