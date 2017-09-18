// @flow
import React from 'react';
import { BaseQuery } from '@ncigdc/modern_components/Query';
import { graphql } from 'react-relay';

export default (Component: ReactClass<*>) => (props: Object) => {
  return (
    <BaseQuery
      parentProps={{ path: 'explore.genes.hits.total', ...props }}
      name="ExploreGeneCount"
      variables={{ filters: props.filters }}
      Component={Component}
      query={graphql`
        query exploreGene_relayQuery($filters: FiltersArgument) {
          viewer {
            explore {
              genes {
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
