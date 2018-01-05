// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
import { compose, withPropsOnChange, branch, renderComponent } from 'recompose';
import Query from '@ncigdc/modern_components/Query';
import { withRouter } from 'react-router-dom';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    branch(
      ({ projectId }) => !projectId,
      renderComponent(() => (
        <div>
          <pre>projectId</pre> must be provided
        </div>
      )),
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
        name="ProjectPrimarySitesTable"
        parentProps={props}
        minHeight={249}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query ProjectPrimarySites_relayQuery($filters: FiltersArgument) {
            viewer {
              projects {
                hits(first: 1, filters: $filters) {
                  total
                  edges {
                    node {
                      id
                      project_id
                      name
                      disease_type
                      primary_site
                      program {
                        name
                      }
                      summary {
                        case_count
                        file_count
                        data_categories {
                          case_count
                          data_category
                        }
                        file_size
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
