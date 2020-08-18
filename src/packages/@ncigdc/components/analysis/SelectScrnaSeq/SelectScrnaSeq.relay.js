import React from 'react';
import { graphql } from 'react-relay';
import { compose, pure, setDisplayName } from 'recompose';

import Query from '@ncigdc/modern_components/Query';

// NOTES
// this query will return 5 cases with either or both workflow_types.
// TODO add real scrnaseq filters & use the commented-out variables properties.

const filters = {
  op: "and",
  content: [
    {
      op: "in",
      content: {
        field: "files.analysis.workflow_type",
        value: [
          "MuSE",
          "VarScan2"
        ]
      }
    }
  ]
};

const variables = {
  cases_offset: 13853,
  // cases_offset: 0,
  cases_size: 5,
  // cases_size: 20,
  cases_sort: [],
  filters,
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
                        primary_site
                        disease_type
                        submitter_id
                        project {
                          project_id
                        }
                        demographic {
                          gender
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
