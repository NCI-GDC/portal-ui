// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
import { compose, withPropsOnChange, branch, renderComponent } from 'recompose';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    branch(
      ({ caseId }) => !caseId,
      renderComponent(() => <div><pre>caseId</pre> must be provided</div>),
    ),
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
      <Query
        parentProps={props}
        minHeight={249}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query CaseSummary_relayQuery(
            $filters: FiltersArgument
          ) {
            viewer {
              repository {
                cases {
                  hits(first: 1 filters: $filters) {
                    edges {
                      node {
                        case_id
                        submitter_id
                        primary_site
                        disease_type
                        annotations {
                          hits(first: 20) {
                            total
                            edges {
                              node {
                                annotation_id
                              }
                            }
                          }
                        }
                        files {
                          hits(first: 0) {
                            total
                          }
                        }
                        project {
                          project_id
                          name
                          program {
                            name
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
