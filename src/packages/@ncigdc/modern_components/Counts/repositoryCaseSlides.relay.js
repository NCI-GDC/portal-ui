// @flow
import React from 'react';
import { BaseQuery } from '@ncigdc/modern_components/Query';
import { graphql } from 'react-relay';
import { get } from 'lodash';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';

export default (Component: ReactClass<*>) => (props: Object) => {
  return (
    <BaseQuery
      parentProps={{
        getter: (viewer: Object) => {
          return get(viewer, 'repository.cases.hits.edges', []).reduce(
            (sum, { node }) => sum + node.files.hits.total,
            0,
          );
        },
        ...props,
      }}
      variables={{
        filters: addInFilters(props.filters, {
          op: 'and',
          content: [
            {
              op: 'in',
              content: {
                field: 'summary.experimental_strategies.experimental_strategy',
                value: ['Tissue Slide', 'Diagnostic Slide'],
              },
            },
          ],
        }),
        slideFilter: makeFilter([
          {
            field: 'files.data_type',
            value: ['Slide Image'],
          },
        ]),
      }}
      Component={Component}
      query={graphql`
        query repositoryCaseSlides_relayQuery(
          $filters: FiltersArgument
          $slideFilter: FiltersArgument
        ) {
          viewer {
            repository {
              cases {
                # only counts file ids for the first 99 cases instead of all
                # becase passing in all with a parent query (10903) caused timeout
                # it's fine because mostly used for one case or disable if 0
                hits(filters: $filters, first: 99) {
                  total
                  edges {
                    node {
                      files {
                        hits(filters: $slideFilter, first: 0) {
                          total
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
};
