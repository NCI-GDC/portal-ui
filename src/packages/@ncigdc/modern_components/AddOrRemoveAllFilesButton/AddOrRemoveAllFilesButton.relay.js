// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
import { compose, withPropsOnChange, branch, renderComponent } from 'recompose';
import { BaseQuery } from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    branch(
      ({ viewer }) => !viewer.repository.cases.hits.edges[0],
      renderComponent(() => <div>No case found.</div>),
    ),
    withPropsOnChange(
      ['viewer'],
      ({ viewer: { repository: { cases: { hits: { edges } } } } }) => {
        const p = edges[0].node;
        return {
          variables: {
            first: p.files.hits.total,
            filters: makeFilter([
              {
                field: 'cases.case_id',
                value: [p.case_id],
              },
            ]),
          },
        };
      },
    ),
  )((props: Object) => {
    return (
      <BaseQuery
        parentProps={props}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query AddOrRemoveAllFilesButton_relayQuery(
            $filters: FiltersArgument
            $first: Int
          ) {
            filesViewer: viewer {
              repository {
                files {
                  hits(first: $first, filters: $filters) {
                    edges {
                      node {
                        acl
                        state
                        file_state
                        access
                        file_id
                        file_size
                        cases {
                          hits(first: 1) {
                            edges {
                              node {
                                project {
                                  project_id
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
          }
        `}
      />
    );
  });
