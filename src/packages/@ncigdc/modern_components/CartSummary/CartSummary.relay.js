// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withPropsOnChange(['defaultFilters'], ({ defaultFilters }) => {
      return {
        variables: {
          filters: defaultFilters,
        },
      };
    }),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        name="CartSummary"
        minHeight={249}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query CartSummary_relayQuery(
            $filters: FiltersArgument
          ) {
            viewer {
              summary: cart_summary {
                aggregations(filters: $filters) {
                  project__project_id {
                    buckets {
                      case_count
                      doc_count
                      file_size
                      key
                    }
                  }
                  fs { value }
                }
              }
            }
          }
        `}
      />
    );
  });
