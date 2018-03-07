// @flow
import React from 'react';
import { BaseQuery } from '@ncigdc/modern_components/Query';
import { graphql } from 'react-relay';
import { get, head } from 'lodash';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';

export default (Component: ReactClass<*>) => (props: Object) => {
  return (
    <BaseQuery
      parentProps={{
        getter: (viewer: Object) => {
          const caseNode = get(
            head(get(viewer, 'repository.cases.hits.edges', [])),
            'node',
            {},
          );
          return caseNode.files.hits.total;
          // const portions = (caseNode.samples || {
          //   hits: { edges: [] },
          // }).hits.edges.reduce(
          //   (acc, { node }) => [
          //     ...acc,
          //     ...node.portions.hits.edges.map(p => p.node),
          //   ],
          //   [],
          // );
          // return portions.reduce(
          //   (acc, { slides }) =>
          //     slides.hits.edges[0]
          //       ? acc.concat(slides.hits.edges[0].node.slide_id)
          //       : acc,
          //   [],
          // );
          // return portions.reduce(
          //   (acc, { slides }) => acc + slides.hits.total,
          //   0,
          // );
        },
        ...props,
      }}
      variables={{
        filters: addInFilters(props.filters),
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
                hits(filters: $filters, first: 1) {
                  edges {
                    node {
                      files {
                        hits(filters: $slideFilter, first: 99) {
                          total
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
              }
            }
          }
        }
      `}
    />
  );
};
