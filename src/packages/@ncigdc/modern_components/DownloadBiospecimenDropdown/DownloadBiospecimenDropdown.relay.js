// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { withRouter } from 'react-router-dom';
import { compose, withPropsOnChange } from 'recompose';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(['filters'], ({ filters }) => {
      return {
        variables: {
          filters,
        },
      };
    }),
  )((props: Object) => {
    const caseQuery =
      props.scope === 'explore'
        ? graphql`
            query DownloadBiospecimenDropdownExplore_relayQuery(
              $filters: FiltersArgument
            ) {
              viewer {
                explore {
                  cases {
                    hits(first: 0, filters: $filters) {
                      total
                    }
                  }
                }
              }
            }
          `
        : graphql`
            query DownloadBiospecimenDropdownRepository_relayQuery(
              $filters: FiltersArgument
            ) {
              viewer {
                repository {
                  cases {
                    hits(first: 0, filters: $filters) {
                      total
                    }
                  }
                }
              }
            }
          `;

    return (
      <Query
        parentProps={props}
        variables={props.variables}
        Component={Component}
        style={{ width: 'auto' }}
        query={caseQuery}
      />
    );
  });
