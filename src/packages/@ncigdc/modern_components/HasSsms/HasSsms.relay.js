import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
import { compose, withPropsOnChange } from 'recompose';
import { BaseQuery } from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) => compose(
  withPropsOnChange(['caseId'], ({ caseId }) => {
    return {
      variables: {
        filters: makeFilter([
          {
            field: 'cases.case_id',
            value: [caseId],
          },
        ]),
      },
    };
  }),
)((props: Object) => {
  return (
    <BaseQuery
      Component={Component}
      name="HasSsms"
      parentProps={props}
      query={graphql`
          query HasSsms_relayQuery($filters: FiltersArgument) {
            viewer {
              explore {
                ssms {
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
