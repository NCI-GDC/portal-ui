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
          const portions = (caseNode.samples || {
            hits: { edges: [] },
          }).hits.edges.reduce(
            (acc, { node }) => [
              ...acc,
              ...node.portions.hits.edges.map(p => p.node),
            ],
            [],
          );
          return portions.reduce(
            (acc, { slides }) => acc + slides.hits.total,
            0,
          );
        },
        ...props,
      }}
      variables={{
        filters: addInFilters(
          props.filters,
          makeFilter([
            { field: 'cases.project.project_id', value: ['TCGA-BRCA'] }, //TODO remove this when other projects slides processed
          ]),
        ),
      }}
      Component={Component}
      query={graphql`
        query repositoryCaseSlides_relayQuery($filters: FiltersArgument) {
          viewer {
            repository {
              cases {
                hits(filters: $filters, first: 1) {
                  edges {
                    node {
                      samples {
                        hits(first: 99) {
                          edges {
                            node {
                              portions {
                                hits(first: 99) {
                                  edges {
                                    node {
                                      slides {
                                        hits(first: 0) {
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
