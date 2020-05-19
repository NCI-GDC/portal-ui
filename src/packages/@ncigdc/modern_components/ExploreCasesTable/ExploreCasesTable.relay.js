import React from 'react';
import { graphql } from 'react-relay';
import {
  compose,
  setDisplayName,
  withPropsOnChange,
} from 'recompose';
import { isEqual } from 'lodash';
import {
  parseIntParam,
  parseFilterParam,
  parseJSONParam,
} from '@ncigdc/utils/uri';
import { withRouter } from 'react-router-dom';
import { parse } from 'query-string';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    setDisplayName('EnhancedExploreCasesTable_Relay'),
    withRouter,
    withPropsOnChange(
      ({ location }, { location: previousLocation }) => !(isEqual(location, previousLocation)),
      ({ defaultFilters = null, defaultSize = 20, location: { search } }) => {
        const q = parse(search);
        const filters = parseFilterParam(q.filters, defaultFilters);
        const score = 'gene.gene_id';
        const sort = parseJSONParam(q.cases_sort, []);
        return {
          filters,
          score,
          sort,
          variables: {
            filters,
            cases_offset: parseIntParam(q.cases_offset, 0),
            cases_size: parseIntParam(q.cases_size, defaultSize),
            cases_sort: sort,
            cases_score: score,
          },
        };
      },
    ),
  )((props: mixed) => {
    return (
      <Query
        cacheConfig={{ requiresStudy: true }}
        Component={Component}
        minHeight={387}
        parentProps={props}
        query={graphql`
          query ExploreCasesTable_relayQuery(
            $filters: FiltersArgument
            $cases_size: Int
            $cases_offset: Int
            $cases_score: String
            $cases_sort: [Sort]
          ) {
            exploreCasesTableViewer: viewer {
              explore {
                cases {
                  hits(
                    first: $cases_size
                    offset: $cases_offset
                    filters: $filters
                    score: $cases_score
                    sort: $cases_sort
                  ) {
                    total
                    edges {
                      node {
                        score
                        id
                        case_id
                        primary_site
                        disease_type
                        submitter_id
                        project {
                          project_id
                          program {
                            name
                          }
                        }
                        diagnoses {
                          hits(first: 1) {
                            edges {
                              node {
                                primary_diagnosis
                                age_at_diagnosis
                              }
                            }
                          }
                        }
                        demographic {
                          gender
                          ethnicity
                          race
                          days_to_death
                          vital_status
                        }
                        summary {
                          data_categories {
                            file_count
                            data_category
                          }
                          experimental_strategies {
                            experimental_strategy
                            file_count
                          }
                          file_count
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
