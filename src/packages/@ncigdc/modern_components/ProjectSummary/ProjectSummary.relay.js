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
      renderComponent(() => (
        <div>
          <pre>projectId</pre> must be provided
        </div>
      ))
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
          annotationsFilters: makeFilter([
            {
              field: 'project.project_id',
              value: [projectId],
            },
          ]),
        },
      };
    })
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        minHeight={249}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query ProjectSummary_relayQuery(
            $filters: FiltersArgument
            $annotationsFilters: FiltersArgument
          ) {
            viewer {
              projects {
                hits(first: 1, filters: $filters) {
                  edges {
                    node {
                      project_id
                      dbgap_accession_number
                      name
                      disease_type
                      primary_site
                      program {
                        name
                        dbgap_accession_number
                      }
                      summary {
                        case_count
                        file_count
                      }
                    }
                  }
                }
              }
              annotations {
                hits(first: 1, filters: $annotationsFilters) {
                  total
                  edges {
                    node {
                      annotation_id
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
