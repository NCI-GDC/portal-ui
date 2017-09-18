// @flow
import React from 'react';
import { BaseQuery } from '@ncigdc/modern_components/Query';
import { graphql } from 'react-relay';

export default (Component: ReactClass<*>) => (props: Object) => {
  return (
    <BaseQuery
      parentProps={{ path: 'explore.ssms.hits.total', ...props }}
      name="ExploreSsmCount"
      variables={{ filters: props.filters }}
      Component={Component}
      query={graphql`
        query exploreSsm_relayQuery($filters: FiltersArgument) {
          viewer {
            explore {
              ssms {
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
