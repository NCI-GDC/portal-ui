// @flow
import React from 'react';
import { BaseQuery } from '@ncigdc/modern_components/Query';
import { graphql } from 'react-relay';

export default (Component: ReactClass<*>) => (props: Object) => {
  return (
    <BaseQuery
      renderOnError
      parentProps={props}
      variables={{ id: btoa(`${props.type}:${props.id}`) }}
      Component={Component}
      query={graphql`
        query exists_relayQuery($id: ID) {
          node(id: $id) {
            id
          }
        }
      `}
    />
  );
};
