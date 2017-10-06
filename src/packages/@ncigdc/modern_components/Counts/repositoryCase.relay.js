// @flow
import React from 'react';
import { BaseQuery } from '@ncigdc/modern_components/Query';
import { graphql } from 'react-relay';

export default (Component: ReactClass<*>) => (props: Object) => {
  return (
    <BaseQuery
      parentProps={{ path: 'repository.cases.hits.total', ...props }}
      variables={{ filters: props.filters }}
      Component={Component}
      query={graphql`
        query repositoryCase_relayQuery($filters: FiltersArgument) {
          viewer {
            repository {
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
