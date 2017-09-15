// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
import { compose, withPropsOnChange, branch, renderComponent } from 'recompose';
import Query from '@ncigdc/modern_components/Query';
import Button from '@ncigdc/uikit/Button';

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
      <Query
        parentProps={props}
        name="AddOrRemoveAllFilesButton"
        minHeight={50}
        variables={props.variables}
        Component={Component}
        customLoader={({ loading }) =>
          !loading ? null : (
            <Button>
              <i className="fa fa-spinner fa-spin" />&nbsp;<span
                style={{ color: 'rgb(154, 176, 189)' }}
              >
                Add all files to the cart
              </span>
            </Button>
          )}
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
                        file_id
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
