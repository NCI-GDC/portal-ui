// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { withRouter } from 'react-router-dom';
import { compose, withPropsOnChange } from 'recompose';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';

import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(
      ['filters', 'selectedIds'],
      ({ filters, selectedIds }) => {
        const downloadFilters =
          selectedIds && selectedIds.length
            ? addInFilters(
              ...filters,
              makeFilter(
                [
                  {
                    field: 'cases.case_id',
                    value: selectedIds,
                  },
                ],
                false,
              ),
            )
            : filters;
        return {
          filters: downloadFilters,
          variables: {
            filters: downloadFilters,
          },
        };
      },
    ),
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
        cacheConfig={{ requiresStudy: props.scope === 'explore' }}
        Component={Component}
        parentProps={props}
        query={caseQuery}
        style={{ width: 'auto' }}
        variables={props.variables}
        />
    );
  });
