// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import Query from '@ncigdc/modern_components/Query';

export default (Component: React$Element<*>) =>
  compose(
    withPropsOnChange(['set1', 'set2', 'facets'], ({ set1, set2, facets }) => {
      return {
        variables: {
          facets,
          filter1: {
            op: 'and',
            content: [
              {
                op: 'in',
                content: {
                  field: 'cases.case_id',
                  value: [`set_id:${set1}`],
                },
              },
            ],
          },
          filter2: {
            op: 'and',
            content: [
              {
                op: 'in',
                content: {
                  field: 'cases.case_id',
                  value: [`set_id:${set2}`],
                },
              },
            ],
          },
        },
      };
    }),
  )((props: Object) => {
    return (
      <Query
        minHeight={500}
        parentProps={props}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query CohortComparison_relayQuery(
            $filter1: FiltersArgument
            $filter2: FiltersArgument
            $facets: [String]!
          ) {
            viewer {
              repository {
                result1: cases {
                  hits(filters: $filter1) {
                    total
                  }
                  facets(filters: $filter1, facets: $facets)
                }
                result2: cases {
                  hits(filters: $filter2) {
                    total
                  }
                  facets(filters: $filter2, facets: $facets)
                }
              }
            }
          }
        `}
      />
    );
  });
