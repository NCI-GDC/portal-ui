// @flow
import React from 'react';
import { BaseQuery } from '@ncigdc/modern_components/Query';
import { graphql } from 'react-relay';

export default (Component: ReactClass<*>) => (props: Object) => {
  return (
    <BaseQuery
      Component={Component}
      parentProps={{
        path: 'explore.ssms.hits.total',
        ...props,
      }}
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
      variables={{ filters: props.filters }} />
  );
};
