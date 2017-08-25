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
  parseJSURLParam,
} from '@ncigdc/utils/uri';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(
      ['location', 'defaultFilters'],
      ({ location, defaultFilters = null, defaultSize = 10 }) => {
        const q = parse(location.search);
        return {
          variables: {
            cases_offset: parseIntParam(q.cases_offset, 0),
            cases_size: parseIntParam(q.cases_size, 20),
            cases_sort: parseJSURLParam(q.cases_sort, null),
            filters: parseFilterParam(q.filters, defaultFilters),
          },
        };
      },
    ),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        name="RepoCasesTable"
        minHeight={387}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query RepoCasesTable_relayQuery(
            $cases_size: Int
            $cases_offset: Int
            $cases_sort: [Sort]
            $filters: FiltersArgument
          ) {
            viewer {
              repository {
                cases {
                  hits(score: "annotations.annotation_id" first: $cases_size offset: $cases_offset, sort: $cases_sort filters: $filters) {
                    total
                    edges {
                      node {
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
                        annotations {
                          hits(first: 1) {
                            total
                            edges {
                              node {
                                annotation_id
                              }
                            }
                          }
                        }
                        demographic {
                          gender
                          ethnicity
                          race
                        }
                        diagnoses {
                          hits(first: 99) {
                            edges {
                              node {
                                primary_diagnosis
                                age_at_diagnosis
                                vital_status
                                days_to_death
                              }
                            }
                          }
                        }
                        summary {
                          data_categories {
                            file_count
                            data_category
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
      />
    );
  });
