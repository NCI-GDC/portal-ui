// @flow
import React from 'react';
import { BaseQuery } from '@ncigdc/modern_components/Query';
import { graphql } from 'react-relay';

export default (Component: ReactClass<*>) => (props: Object) => {
  return (
    <BaseQuery
      parentProps={{ path: 'explore.cases.facets', ...props }} // path??
      variables={{ filters: props.filters, facets: props.facets }}
      Component={Component}
      query={graphql`
        query exploreFacet_relayQuery($filters: FiltersArgument, $facets: [String]!) {
          viewer {
            explore {
              cases {
                facets(facets: $facets filters: $filters)
              }
            }
          }
        }
      `}
    />
  );
};
