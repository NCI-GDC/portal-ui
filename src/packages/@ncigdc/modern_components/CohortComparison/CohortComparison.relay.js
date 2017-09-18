// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { get, isEqual } from 'lodash';

import Query from '@ncigdc/modern_components/Query';
import withRouter from '@ncigdc/utils/withRouter';
import { parseJSONParam } from '@ncigdc/utils/uri';

export default (Component: React$Element<*>) =>
  compose(
    withRouter,
    withPropsOnChange(
      (props, nextProps) =>
        ['sets', 'query.activeFacets'].some(
          k => !isEqual(get(props, k), get(nextProps, k)),
        ),
      ({ sets, query }) => {
        const [[setId1, setName1], [setId2, setName2]] = Object.entries(
          sets.case,
        );

        const activeFacets =
          typeof query.activeFacets !== 'undefined'
            ? parseJSONParam(query.activeFacets)
            : [
                'demographic.gender',
                'diagnoses.vital_status',
                'demographic.race',
              ];

        return {
          setId1,
          setId2,
          setName1,
          setName2,
          activeFacets,
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
          },
        };
      },
    ),
  )((props: Object) => {
    return (
      <Query
        minHeight={500}
        parentProps={props}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query CohortComparison_relayQuery(
            $filter1: FiltersArgument
            $filter2: FiltersArgument
            $facets: [String]!
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
                      histogram(interval: 3652.4444444444) {
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
                      histogram(interval: 3652.4444444444) {
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
      />
    );
  });
