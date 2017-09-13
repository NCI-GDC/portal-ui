// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import Query from '@ncigdc/modern_components/Query';

export default (Component: React$Element<*>) =>
  compose(
    withPropsOnChange(['data'], ({ data }) => {
      return {
        variables: {
          data,
        },
      };
    }),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query Pvalue_relayQuery(
            $data: [[Int]]!
          ) {
            analysis {
              pvalue(data: $data)
            }
          }
        `}
      />
    );
  });
