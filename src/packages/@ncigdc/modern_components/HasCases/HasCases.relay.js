import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
import { compose, withPropsOnChange } from 'recompose';
import { BaseQuery } from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) => compose(
  withPropsOnChange(['projectId', 'mutated'], ({ projectId, mutated }) => {
    return {
      variables: {
        filters: makeFilter([
          {
            field: 'cases.project.project_id',
            value: [projectId],
          },
          ...(mutated
              ? [
                {
                  field: 'cases.available_variation_data',
                  value: ['ssm'],
                },
              ]
              : []),
        ]),
      },
    };
  }),
)((props: Object) => {
  return (
    <BaseQuery
      Component={Component}
      name="HasCases"
      parentProps={props}
      query={graphql`
          query HasCases_relayQuery($filters: FiltersArgument) {
            viewer {
              explore {
                cases {
                  hits(first: 0, filters: $filters) {
                    total
                  }
                }
              }
            }
          }
        `}
      variables={props.variables} />
  );
});
