import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import Query from '@ncigdc/modern_components/Query';
import { makeFilter } from '@ncigdc/utils/filters';
import { withRouter } from 'react-router-dom';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(['caseId'], ({ filteredAE }) => {
      return {
        variables: {
          filters: makeFilter([
            {
              field: 'cases.case_id',
              value: filteredAE.map(ae => ae.case_id),
            },
          ]),
        },
      };
    }),
  )((props: Object) => {
    return (
      <Query
        name="AssociatedEntitiesTable"
        minHeight={387}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query AssociatedEntitiesTable_relayQuery($filters: FiltersArgument) {
            viewer {
              repository {
                cases {
                  hits(filters: $filters) {
                    edges {
                      node {
                        samples {
                          hits {
                            edges {
                              node {
                                sample_type
                              }
                            }
                          }
                        }
                      }
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
