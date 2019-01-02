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
      const ssmAvailableVariationDataFilter = {
        field: 'cases.available_variation_data',
        value: ['ssm'],
      };
      return {
        variables: {
          cnvAll: replaceFilters(
            makeFilter([
              {
                field: 'cnvs.cnv_change',
                value: ['Gain', 'Loss'],
              },
              cnvAvailableVariationDataFilter,
            ]),
            filters,
          ),
          cnvTestedByGene: replaceFilters(
            makeFilter([cnvAvailableVariationDataFilter]),
            filters,
          ),
          ssmFilters: replaceFilters(
            makeFilter([ssmAvailableVariationDataFilter]),
            filters,
          ),
          caseAggsFilters: replaceFilters(
            {
              op: 'and',
              content: [
                {
                  op: 'NOT',
                  content: {
                    field: 'cases.gene.ssm.observation.observation_id',
                    value: 'MISSING',
                  },
                },
                {
                  op: 'in',
                  content: ssmAvailableVariationDataFilter,
                },
              ],
            },
            filters,
          ),
          ssmTested: makeFilter([ssmAvailableVariationDataFilter]),
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
          // cnvAmplification: replaceFilters(
          //   makeFilter([
          //     {
          //       field: 'cnvs.cnv_change',
          //       value: ['Amplification'],
          //     },
          //     cnvAvailableVariationDataFilter,
          //   ]),
          //   filters,
          // ),
          cnvLoss: replaceFilters(
            makeFilter([
              {
                field: 'cnvs.cnv_change',
                value: ['Loss'],
              },
              cnvAvailableVariationDataFilter,
            ]),
            filters,
          ),
          // cnvDeepLoss: replaceFilters(
          //   makeFilter([
          //     {
          //       field: 'cnvs.cnv_change',
          //       value: ['Deep Loss'],
          //     },
          //     cnvAvailableVariationDataFilter,
          //   ]),
          //   filters,
          // ),
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
            $cnvLoss: FiltersArgument
            $cnvTested: FiltersArgument
            $cnvTestedByGene: FiltersArgument
            $cnvAll: FiltersArgument
            $ssmFilters: FiltersArgument
          ) {
            viewer {
              explore {
                ssms {
                  hits(first: 0, filters: $ssmFilters) {
                    total
                  }
                }
                cases {
                  cnvAll: hits(filters: $cnvAll) {
                    total
                  }
                  cnvTestedByGene: hits(filters: $cnvTestedByGene) {
                    total
                  }
                  gain: aggregations(filters: $cnvGain) {
                    project__project_id {
                      buckets {
                        doc_count
                        key
                      }
                    }
                  }
                  loss: aggregations(filters: $cnvLoss) {
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
