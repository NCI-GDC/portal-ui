import React from 'react';
import Query from '@ncigdc/modern_components/Query';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange, branch, renderComponent } from 'recompose';

export default (Component: ReactClass<*>) =>
  compose(
    branch(
      ({ name }) => !name,
      renderComponent(() => (
        <div>
          <pre>Type name</pre> must be provided
        </div>
      ))
    ),
    withPropsOnChange(['name'], ({ name }) => ({ variables: { name } }))
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query Introspective_relayQuery($name: String!) {
            __type(name: $name) {
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
      />
    );
  });
