import React from 'react';
import Query from '@ncigdc/modern_components/Query';
import { graphql } from 'react-relay';
import {
  branch,
  compose,
  renderComponent,
  setDisplayName,
  withPropsOnChange,
} from 'recompose';

export default (Component: ReactClass<*>) => compose(
  setDisplayName('EnhancedIntrospective_Relay'),
  branch(
    ({ typeName }) => !typeName,
    renderComponent(() => (
      <div>
        <pre>Type name</pre>
        {' '}
        must be provided
      </div>
    ))
  ),
  withPropsOnChange(['typeName'], ({ typeName }) => ({
    variables: { typeName },
  }))
)((props: Object) => (
  <Query
    Component={Component}
    parentProps={props}
    query={graphql`
      query Introspective_relayQuery($typeName: String!) {
        __type(name: $typeName) {
          name
          fields {
            name
            description
            type {
              name
              fields {
                name
                description
                type {
                  name
                }
              }
            }
          }
        }
      }
    `}
    variables={props.variables}
    />
));
