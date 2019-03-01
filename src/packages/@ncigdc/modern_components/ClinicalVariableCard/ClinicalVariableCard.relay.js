import React from 'react';
import Query from '@ncigdc/modern_components/Query';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange, branch, renderComponent } from 'recompose';

export default (Component: ReactClass<*>) =>
  compose(
    branch(
      ({ facetField }) => !facetField,
      renderComponent(() => <div>Facet must be provided</div>)
    ),
    withPropsOnChange(['facetField', 'filters'], ({ facetField, filters }) => ({
      variables: { facetField, filters },
    }))
  )((props: any) => {
    return (
      <Query
        parentProps={props}
        variables={props.variables}
        Component={Component}
        query={graphql`
        query ClinicalVariableCard_relayQuery(
          $facetField: [String]!
          $filters: FiltersArgument
        ) {
          viewer {
            explore {
              cases {
                facets(facets: $facetField filters: $filters)
              }
            }
          }
        }
      `}
      />
    );
  });
