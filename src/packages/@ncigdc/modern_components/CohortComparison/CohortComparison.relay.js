// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { get, isEqual } from 'lodash';

import Query from '@ncigdc/modern_components/Query';
import withRouter from '@ncigdc/utils/withRouter';
import { parseJSONParam } from '@ncigdc/utils/uri';
import { DAYS_IN_YEAR } from '@ncigdc/utils/ageDisplay';

export default (Component: React$Element<*>) =>
  compose(
    withRouter,
    withPropsOnChange(
      (props, nextProps) =>
        ['sets', 'query.activeFacets'].some(
          k => !isEqual(get(props, k), get(nextProps, k)),
        ),
      ({ query, sets }) => {
        const [[setId1, setName1], [setId2, setName2]] = Object.entries(
          sets.case,
        );

        const activeFacets =
          typeof query.activeFacets !== 'undefined'
            ? parseJSONParam(query.activeFacets)
            : [
              'demographic.gender',
              'diagnoses.age_at_diagnosis',
              'demographic.vital_status',
            ];

        return {
          activeFacets,
          setId1,
          setId2,
          setName1,
          setName2,
          variables: {
            facets: activeFacets,
            filter1: {
              op: 'and',
              content: [
                {
                  op: 'in',
                  content: {
                    field: 'cases.case_id',
                    value: [`set_id:${setId1}`],
                  },
                },
              ],
            },
            filter2: {
              op: 'and',
              content: [
                {
                  op: 'in',
                  content: {
                    field: 'cases.case_id',
                    value: [`set_id:${setId2}`],
                  },
                },
              ],
            },
            interval: 10 * DAYS_IN_YEAR,
          },
        };
      },
    ),
  )((props: Object) => {
    return (
      <Query
        Component={Component}
        minHeight={500}
        parentProps={props}
        query={graphql`
          query CohortComparison_relayQuery(
            $filter1: FiltersArgument
            $filter2: FiltersArgument
            $facets: [String]!
            $interval: Float
          ) {
            viewer {
              repository {
                result1: cases {
                  hits(filters: $filter1) {
                    total
                  }
                  facets(filters: $filter1, facets: $facets)
                  aggregations(filters: $filter1) {
                    diagnoses__age_at_diagnosis {
                      stats {
                        min
                        max
                      }
                      histogram(interval: $interval) {
                        buckets {
                          doc_count
                          key
                        }
                      }
                    }
                  }
                }
                result2: cases {
                  hits(filters: $filter2) {
                    total
                  }
                  facets(filters: $filter2, facets: $facets)
                  aggregations(filters: $filter2) {
                    diagnoses__age_at_diagnosis {
                      stats {
                        min
                        max
                      }
                      histogram(interval: $interval) {
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
          }
        `}
        variables={props.variables}
        />
    );
  });
