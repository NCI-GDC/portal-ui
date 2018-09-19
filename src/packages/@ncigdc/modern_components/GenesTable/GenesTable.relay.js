import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { parseIntParam, parseFilterParam } from '@ncigdc/utils/uri';
import { withRouter } from 'react-router-dom';
import { parse } from 'query-string';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(
      ['location'],
      ({ location: { search }, defaultSize = 10, defaultFilters = null }) => {
        const q = parse(search);
        const score = 'case.project.project_id';
        return {
          filters: defaultFilters,
          score,
          variables: {
            genesTable_filters: parseFilterParam(
              q.genesTable_filters,
              defaultFilters,
            ),
            genesTable_offset: parseIntParam(q.genesTable_offset, 0),
            genesTable_size: parseIntParam(q.genesTable_size, defaultSize),
            geneCaseFilter: addInFilters(
              q.genesTable_filters || defaultFilters,
              makeFilter([
                {
                  field: 'cases.available_variation_data',
                  value: 'ssm',
                },
              ]),
            ),
            score,
            ssmTested: makeFilter([
              {
                field: 'cases.available_variation_data',
                value: 'ssm',
              },
            ]),
            cnvTested: makeFilter([
              {
                field: 'cases.available_variation_data',
                value: 'cnv',
              },
            ]),
            filters_1: makeFilter([
              {
                field: 'cnvs.cnv_change',
                value: 'Amplification',
              },
            ]),
            filters_2: makeFilter([
              {
                field: 'cnvs.cnv_change',
                value: 'Gain',
              },
            ]),
            filters_3: makeFilter([
              {
                field: 'cnvs.cnv_change',
                value: 'Shallow Loss',
              },
            ]),
            filters_4: makeFilter([
              {
                field: 'cnvs.cnv_change',
                value: 'Deep Loss',
              },
            ]),
          },
        };
      },
    ),
  )((props: mixed) => {
    return (
      <Query
        parentProps={props}
        minHeight={387}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query GenesTable_relayQuery(
            $genesTable_filters: FiltersArgument
            $genesTable_size: Int
            $genesTable_offset: Int
            $score: String
            $geneCaseFilter: FiltersArgument
            $ssmTested: FiltersArgument
            $cnvTested: FiltersArgument
            $filters_1: FiltersArgument
            $filters_2: FiltersArgument
            $filters_3: FiltersArgument
            $filters_4: FiltersArgument
          ) {
            genesTableViewer: viewer {
              explore {
                cases {
                  hits(first: 0, filters: $ssmTested) {
                    total
                  }
                }
                filteredCases: cases {
                  hits(first: 0, filters: $geneCaseFilter) {
                    total
                  }
                }
                genes {
                  hits(
                    first: $genesTable_size
                    offset: $genesTable_offset
                    filters: $genesTable_filters
                    score: $score
                  ) {
                    total
                    edges {
                      node {
                        id
                        numCases: score
                        symbol
                        name
                        cytoband
                        biotype
                        gene_id
                        is_cancer_gene_census
                        case {
                          hits(first: 0, filters: $ssmTested) {
                            total
                          }
                        }
                        cnv_case: case {
                          hits(first: 0, filters: $cnvTested) {
                            total
                          }
                        }
                        case_with_cnv_amplification_count: case {
                          hits(first: 0, filters: $filters_1) {
                            total
                          }
                        }
                        case_with_cnv_gain_count: case {
                          hits(first: 0, filters: $filters_2) {
                            total
                          }
                        }
                        case_with_cnv_loss_count: case {
                          hits(first: 0, filters: $filters_3) {
                            total
                          }
                        }
                        case_with_cnv_deep_loss_count: case {
                          hits(first: 0, filters: $filters_4) {
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
  });
