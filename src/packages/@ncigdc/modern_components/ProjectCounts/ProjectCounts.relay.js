// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
import { compose, withPropsOnChange, branch, renderComponent } from 'recompose';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    branch(
      ({ projectId }) => !projectId,
      renderComponent(() => <div><pre>projectId</pre> must be provided</div>),
    ),
    withPropsOnChange(['projectId'], ({ projectId }) => {
      return {
        variables: {
          filters: makeFilter([
            {
              field: 'projects.project_id',
              value: [projectId],
            },
          ]),
        },
      };
    }),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        minHeight={252}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query ProjectCounts_relayQuery(
            $filters: FiltersArgument
          ) {
            viewer {
              projects {
                hits(first: 1 filters: $filters) {
                  edges {
                    node {
                      project_id
                      name
                      disease_type
                      program {
                        name
                      }
                      primary_site
                      summary {
                        case_count
                        file_count
                        experimental_strategies {
                          experimental_strategy
                          file_count
                          case_count
                        }
                        data_categories {
                          data_category
                          file_count
                          case_count
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
