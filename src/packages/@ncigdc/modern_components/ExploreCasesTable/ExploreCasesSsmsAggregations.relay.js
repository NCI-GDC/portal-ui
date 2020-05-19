import React from 'react';
import { graphql } from 'react-relay';
import {
  compose,
  setDisplayName,
  withPropsOnChange,
} from 'recompose';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    setDisplayName('EnhancedExploreCasesSSmsAggregations_relay'),
    withPropsOnChange(
      ['exploreCasesTableViewer'],
      ({ exploreCasesTableViewer, filters = null }) => {
        const { hits } = exploreCasesTableViewer.explore.cases;
        const caseIds = hits.edges.map(e => e.node.case_id);

        return {
          variables: {
            ssmCountsfilters: caseIds.length
              ? addInFilters(
                filters,
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
        cacheConfig={{ requiresStudy: true }}
        Component={Component}
        minHeight={387}
        parentProps={props}
        query={graphql`
          query ExploreCasesSsmsAggregations_relayQuery(
            $ssmCountsfilters: FiltersArgument
          ) {
            ssmsAggregationsViewer: viewer {
              explore {
                ssms {
                  aggregations(
                    filters: $ssmCountsfilters
                    aggregations_filter_themselves: true
                  ) {
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
        variables={props.variables}
        />
    );
  });
