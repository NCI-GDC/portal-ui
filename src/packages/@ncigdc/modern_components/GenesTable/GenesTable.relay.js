import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { parseIntParam, parseFilterParam } from '@ncigdc/utils/uri';
import { withRouter } from 'react-router-dom';
import { parse } from 'query-string';

import {
  makeFilter,
  addInFilters,
  replaceFilters,
  removeFilterWithOp,
} from '@ncigdc/utils/filters';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(
      ['location'],
      ({ location: { search }, defaultSize = 10, defaultFilters = null }) => {
        const q = parse(search);
        const score = 'case.project.project_id';

        const cnvFilters = replaceFilters(
          makeFilter([
            {
              field: 'cases.available_variation_data',
              value: ['cnv'],
            },
          ]),
          q.genesTable_filters || defaultFilters
        );

        return {
          filters: defaultFilters,
          score,
          variables: {
            genesTable_filters: parseFilterParam(
              q.genesTable_filters,
              defaultFilters
            ),
            genesTable_offset: parseIntParam(q.genesTable_offset, 0),
            genesTable_size: parseIntParam(q.genesTable_size, defaultSize),
            geneCaseFilter: removeFilterWithOp(
              (op, field) => op.match(/^NOT$/) && field.match(/^ssms.ssm_id/),
              addInFilters(
                q.genesTable_filters || defaultFilters,
                makeFilter([
                  {
                    field: 'cases.available_variation_data',
                    value: ['ssm'],
                  },
                ])
              )
            ),
            score,
            ssmCase: {
              op: 'and',
              content: [
                {
                  op: 'in',
                  content: {
                    field: 'cases.available_variation_data',
                    value: ['ssm'],
                  },
                },
                {
                  op: 'NOT',
                  content: {
                    field: 'genes.case.ssm.observation.observation_id',
                    value: 'MISSING',
                  },
                },
              ],
            },
            ssmTested: makeFilter([
              {
                field: 'cases.available_variation_data',
                value: ['ssm'],
              },
            ]),
            cnvTested: cnvFilters,
            cnvGainFilters: replaceFilters(
              makeFilter([
                {
                  field: 'cnvs.cnv_change',
                  value: ['Gain'],
                },
              ]),
              cnvFilters
            ),

            cnvLossFilters: replaceFilters(
              makeFilter([
                {
                  field: 'cnvs.cnv_change',
                  value: ['Loss'],
                },
              ]),
              cnvFilters
            ),
          },
        };
      }
    )
  )((props: mixed) => {
    return (
      <Query
        cacheConfig={{ requiresStudy: props.scope === 'explore' }}
        Component={Component}
        minHeight={387}
        parentProps={props}
        query={graphql`
          query GenesTable_relayQuery(
            $genesTable_filters: FiltersArgument
            $genesTable_size: Int
            $genesTable_offset: Int
            $score: String
            $ssmCase: FiltersArgument
            $geneCaseFilter: FiltersArgument
            $ssmTested: FiltersArgument
            $cnvTested: FiltersArgument
            $cnvGainFilters: FiltersArgument
            $cnvLossFilters: FiltersArgument
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
                cnvCases: cases {
                  hits(first: 0, filters: $cnvTested) {
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
                        ssm_case: case {
                          hits(first: 0, filters: $ssmCase) {
                            total
                          }
                        }
                        cnv_case: case {
                          hits(first: 0, filters: $cnvTested) {
                            total
                          }
                        }
                        case_cnv_gain: case {
                          hits(first: 0, filters: $cnvGainFilters) {
                            total
                          }
                        }
                        case_cnv_loss: case {
                          hits(first: 0, filters: $cnvLossFilters) {
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
