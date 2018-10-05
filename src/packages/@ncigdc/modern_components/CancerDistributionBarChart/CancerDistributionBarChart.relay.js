/* @flow */

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { makeFilter, replaceFilters } from '@ncigdc/utils/filters';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withPropsOnChange(['filters'], ({ filters = null }) => {
      const cnvAvailableVariationDataFilter = {
        field: 'cases.available_variation_data',
        value: 'cnv',
      };
      return {
        variables: {
          caseAggsFilters: filters,
          ssmTested: makeFilter([
            {
              field: 'cases.available_variation_data',
              value: ['ssm'],
            },
          ]),
          cnvTested: makeFilter([cnvAvailableVariationDataFilter]),
          cnvGain: replaceFilters(
            makeFilter([
              {
                field: 'cnvs.cnv_change',
                value: ['Gain'],
              },
              cnvAvailableVariationDataFilter,
            ]),
            filters,
          ),
          cnvAmplification: replaceFilters(
            makeFilter([
              {
                field: 'cnvs.cnv_change',
                value: ['Amplification'],
              },
              cnvAvailableVariationDataFilter,
            ]),
            filters,
          ),
          cnvLoss: replaceFilters(
            makeFilter([
              {
                field: 'cnvs.cnv_change',
                value: ['Shallow Loss'],
              },
              cnvAvailableVariationDataFilter,
            ]),
            filters,
          ),
          cnvDeepLoss: replaceFilters(
            makeFilter([
              {
                field: 'cnvs.cnv_change',
                value: ['Deep Loss'],
              },
              cnvAvailableVariationDataFilter,
            ]),
            filters,
          ),
        },
      };
    }),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        minHeight={10}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query CancerDistributionBarChart_relayQuery(
            $caseAggsFilters: FiltersArgument
            $ssmTested: FiltersArgument
            $cnvGain: FiltersArgument
            $cnvAmplification: FiltersArgument
            $cnvLoss: FiltersArgument
            $cnvDeepLoss: FiltersArgument
            $cnvTested: FiltersArgument
          ) {
            viewer {
              explore {
                ssms {
                  hits(first: 0, filters: $caseAggsFilters) {
                    total
                  }
                }
                cases {
                  gain: aggregations(filters: $cnvGain) {
                    project__project_id {
                      buckets {
                        doc_count
                        key
                      }
                    }
                  }
                  amplification: aggregations(filters: $cnvAmplification) {
                    project__project_id {
                      buckets {
                        doc_count
                        key
                      }
                    }
                  }
                  shallowLoss: aggregations(filters: $cnvLoss) {
                    project__project_id {
                      buckets {
                        doc_count
                        key
                      }
                    }
                  }
                  deepLoss: aggregations(filters: $cnvDeepLoss) {
                    project__project_id {
                      buckets {
                        doc_count
                        key
                      }
                    }
                  }
                  cnvTotal: aggregations(filters: $cnvTested) {
                    project__project_id {
                      buckets {
                        doc_count
                        key
                      }
                    }
                  }
                  filtered: aggregations(filters: $caseAggsFilters) {
                    project__project_id {
                      buckets {
                        doc_count
                        key
                      }
                    }
                  }
                  total: aggregations(filters: $ssmTested) {
                    project__project_id {
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
