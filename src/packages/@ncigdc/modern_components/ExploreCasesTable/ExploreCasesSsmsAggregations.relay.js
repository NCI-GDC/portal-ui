import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withPropsOnChange(
      ['exploreCasesTableViewer'],
      ({ exploreCasesTableViewer, defaultFilters = null }) => {
        const { hits } = exploreCasesTableViewer.explore.cases;
        const caseIds = hits.edges.map(e => e.node.case_id);

        return {
          variables: {
            ssmCountsfilters: caseIds.length
              ? addInFilters(
                  defaultFilters,
                  makeFilter(
                    [
                      {
                        field: 'occurrence.case.case_id',
                        value: caseIds,
                      },
                    ],
                    false,
                  ),
                )
              : null,
          },
        };
      },
    ),
  )((props: mixed) => {
    return (
      <Query
        parentProps={props}
        minHeight={387}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query ExploreCasesSsmsAggregations_relayQuery(
            $ssmCountsfilters: FiltersArgument
          ) {
            ssmsAggregationsViewer: viewer {
              explore {
                ssms {
                  aggregations(filters: $ssmCountsfilters aggregations_filter_themselves: true) {
                    occurrence__case__case_id {
                      buckets {
                        key
                        doc_count
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
