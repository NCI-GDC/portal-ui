// @flow
import React from 'react';
import { BaseQuery } from '@ncigdc/modern_components/Query';
import { graphql } from 'react-relay';

export default (Component: ReactClass<*>) => (props: Object) => {
  return (
    <BaseQuery
      parentProps={{ path: 'explore.cases.hits.total', ...props }}
      name="ExploreCaseCount"
      variables={{ filters: props.filters }}
      Component={Component}
      query={graphql`
        query exploreCase_relayQuery($filters: FiltersArgument) {
          viewer {
            explore {
              cases {
                hits(filters: $filters, first: 0) {
                  total
                }
              }
            }
          }
        }
      `}
    />
  );
};
