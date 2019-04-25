// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { connect } from 'react-redux';
import Query from '@ncigdc/modern_components/Query';
import { parseFilterParam } from '@ncigdc/utils/uri';
import withRouter from '@ncigdc/utils/withRouter';
import { parse } from 'query-string';

const entityType = 'Files';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(
      ['location'],
      ({ location: { search }, defaultFilters = null }) => {
        const q = parse(search);
        const filters = parseFilterParam(q.filters, defaultFilters);
        return {
          filters,
        };
      },
    ),
    connect((state, props) => ({
      userSelectedFacets: state.customFacets[entityType],
    })),
    withPropsOnChange(
      ['userSelectedFacets', 'filters'],
      ({ userSelectedFacets, filters }) => {
        return {
          variables: {
            filters,
            repoFileCustomFacetFields: userSelectedFacets
              .map(({ field }) => field)
              .join(','),
          },
        };
      },
    ),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        minHeight={578}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query FileAggregations_relayQuery(
            $filters: FiltersArgument
            $repoFileCustomFacetFields: [String]!
          ) {
            viewer {
              repository {
                files {
                  facets(facets: $repoFileCustomFacetFields, filters: $filters)
                  aggregations(
                    filters: $filters
                    aggregations_filter_themselves: false
                  ) {
                    data_category {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    data_type {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    experimental_strategy {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    analysis__workflow_type {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    data_format {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    platform {
                      buckets {
                        doc_count
                        key
                      }
                    }
                    access {
                      buckets {
                        doc_count
                        key
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
