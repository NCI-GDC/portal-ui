/* @flow */

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { makeFilter } from '@ncigdc/utils/filters';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) => compose(
  withPropsOnChange(['filters'], ({ filters = null }) => {
    return {
      variables: {
        caseAggsFilters: filters,
        ssmTested: makeFilter([
          {
            field: 'cases.available_variation_data',
            value: ['ssm'],
          },
        ]),
      },
    };
  }),
)((props: Object) => {
  return (
    <Query
      Component={Component}
      minHeight={10}
      parentProps={props}
      query={graphql`
          query CancerDistributionSsmBarChart_relayQuery(
            $caseAggsFilters: FiltersArgument
            $ssmTested: FiltersArgument
          ) {
            viewer {
              explore {
                ssms {
                  hits(first: 0, filters: $caseAggsFilters) {
                    total
                  }
                }
                cases {
                  filtered: aggregations(filters: $caseAggsFilters) {
                    project__project_id {
                      buckets {
                        doc_count
                        key
                      }
                    }
                  }
                  total: aggregations(filters: $ssmTested) {
                    project__project_id {
                      buckets {
                        doc_count
                        key
                      }
                    }
                  }
                }
              }
            }
          }
        `}
      variables={props.variables} />
  );
});
