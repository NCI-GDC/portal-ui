// @flow
import React from 'react';
import { BaseQuery } from '@ncigdc/modern_components/Query';
import { graphql } from 'react-relay';

export default (Component: ReactClass<*>) => (props: Object) => {
  return (
    <BaseQuery
      Component={Component}
      parentProps={props}
      query={graphql`
        query exists_relayQuery($id: ID) {
          node(id: $id) {
            id
          }
        }
      `}
      variables={{ id: btoa(`${props.type}:${props.id}`) }} />
  );
};
