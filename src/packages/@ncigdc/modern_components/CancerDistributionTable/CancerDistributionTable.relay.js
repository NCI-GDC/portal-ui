/* @flow */

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { makeFilter } from '@ncigdc/utils/filters';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withPropsOnChange(['filters'], ({ filters = null }) => {
      const cnvAvailableVariationDataFilter = {
        field: 'cases.available_variation_data',
        value: 'cnv',
      };
      let geneFilter = {};
      filters.content.forEach(c => {
        if (c.content.field === 'genes.gene_id') {
          geneFilter = c.content;
        }
      });
      return {
        variables: {
          ssmTested: makeFilter([
            {
              field: 'cases.available_variation_data',
              value: 'ssm',
            },
          ]),
          cnvTested: makeFilter([cnvAvailableVariationDataFilter]),
          cnvGainFilter: makeFilter([
            cnvAvailableVariationDataFilter,
            geneFilter,
            {
              field: 'cnvs.cnv_change',
              value: ['Gain', 'Amplification'],
            },
          ]),
          cnvLossFilter: makeFilter([
            cnvAvailableVariationDataFilter,
            geneFilter,
            {
              field: 'cnvs.cnv_change',
              value: ['Shallow Loss', 'Deep Loss'],
            },
          ]),
          caseAggsFilter: filters,
          ssmCountsFilters: filters,
        },
      };
    }),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        minHeight={50}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query CancerDistributionTable_relayQuery(
            $ssmTested: FiltersArgument
            $ssmCountsFilters: FiltersArgument
            $caseAggsFilter: FiltersArgument
            $cnvGainFilter: FiltersArgument
            $cnvLossFilter: FiltersArgument
            $cnvTested: FiltersArgument
          ) {
            viewer {
              explore {
                ssms {
                  aggregations(filters: $ssmCountsFilters) {
                    occurrence__case__project__project_id {
                      buckets {
                        key
                        doc_count
                      }
                    }
                  }
                }
                cases {
                  filtered: aggregations(filters: $caseAggsFilter) {
                    project__project_id {
                      buckets {
                        doc_count
                        key
                      }
                    }
                  }
                  cnvGain: aggregations(filters: $cnvGainFilter) {
                    project__project_id {
                      buckets {
                        doc_count
                        key
                      }
                    }
                  }
                  cnvLoss: aggregations(filters: $cnvLossFilter) {
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
