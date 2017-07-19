/* @flow */

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { makeFilter } from '@ncigdc/utils/filters';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withPropsOnChange(['filters'], ({ filters = null }) => {
      return {
        variables: {
          ssmTested: makeFilter([
            {
              field: 'cases.available_variation_data',
              value: 'ssm',
            },
          ]),
          caseAggsFilter: filters,
          ssmCountsFilters: filters,
        },
      };
    }),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        name="CancerDistributionTable"
        minHeight={50}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query CancerDistributionTable_relayQuery(
            $ssmTested: FiltersArgument
            $ssmCountsFilters: FiltersArgument
            $caseAggsFilter: FiltersArgument
          ) {
            viewer {
              explore {
                ssms {
                  aggregations(filters: $ssmCountsFilters) {
                    occurrence__case__project__project_id {
                      buckets {
                        key
                        doc_count
                      }
                    }
                  }
                }
                cases {
                  filtered: aggregations(filters: $caseAggsFilter) {
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
      />
    );
  });
