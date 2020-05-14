/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { withRouter } from 'react-router-dom';
import { parse } from 'query-string';
import {
  parseIntParam,
  parseFilterParam,
  parseJSONParam,
} from '@ncigdc/utils/uri';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(
      ['location', 'defaultFilters', 'defaultSize'],
      ({
        location,
        defaultFilters = null,
        contextFilters = null,
        defaultSize = 10,
      }) => {
        const q = parse(location.search);
        return {
          filters: defaultFilters,
          variables: {
            ssmsTable_filters: parseFilterParam(
              q.ssmsTable_filters,
              defaultFilters,
            ),
            ssmsTable_offset: parseIntParam(q.ssmsTable_offset, 0),
            ssmsTable_size: parseIntParam(q.ssmsTable_size, defaultSize),
            ssmsTable_sort: parseJSONParam(q.ssmsTable_sort, null),
            ssmCaseFilter: addInFilters(
              q.ssmsTable_filters || contextFilters || defaultFilters,
              makeFilter([
                {
                  field: 'available_variation_data',
                  value: 'ssm',
                },
              ]),
            ),
            score: 'occurrence.case.project.project_id',
            consequenceFilters: makeFilter([
              {
                field: 'consequence.transcript.is_canonical',
                value: 'true',
              },
            ]),
            ssmTested: makeFilter([
              {
                field: 'cases.available_variation_data',
                value: 'ssm',
              },
            ]),
            sort: [
              { field: '_score', order: 'desc' },
              { field: '_uid', order: 'asc' },
            ],
          },
        };
      },
    ),
  )((props: Object) => {
    return (
      <Query
        cacheConfig={{ requiresStudy: props.scope === 'explore' }}
        Component={Component}
        minHeight={387}
        parentProps={props}
        query={graphql`
          query SsmsTable_relayQuery(
            $ssmTested: FiltersArgument
            $ssmCaseFilter: FiltersArgument
            $ssmsTable_size: Int
            $consequenceFilters: FiltersArgument
            $ssmsTable_offset: Int
            $ssmsTable_filters: FiltersArgument
            $score: String
            $sort: [Sort]
          ) {
            viewer {
              explore {
                cases {
                  hits(first: 0, filters: $ssmTested) {
                    total
                  }
                }
                filteredCases: cases {
                  hits(first: 0, filters: $ssmCaseFilter) {
                    total
                  }
                }
                ssms {
                  hits(
                    first: $ssmsTable_size
                    offset: $ssmsTable_offset
                    filters: $ssmsTable_filters
                    score: $score
                    sort: $sort
                  ) {
                    total
                    edges {
                      node {
                        id
                        score
                        genomic_dna_change
                        mutation_subtype
                        ssm_id
                        consequence {
                          hits(first: 1, filters: $consequenceFilters) {
                            edges {
                              node {
                                transcript {
                                  is_canonical
                                  annotation {
                                    vep_impact
                                    polyphen_impact
                                    polyphen_score
                                    sift_score
                                    sift_impact
                                  }
                                  consequence_type
                                  gene {
                                    gene_id
                                    symbol
                                  }
                                  aa_change
                                }
                              }
                            }
                          }
                        }
                        filteredOccurences: occurrence {
                          hits(first: 0, filters: $ssmCaseFilter) {
                            total
                          }
                        }
                        occurrence {
                          hits(first: 0, filters: $ssmTested) {
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
        variables={props.variables}
        />
    );
  });
