/* @flow */

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
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(
      ['location'],
      ({ location, defaultFilters = null, defaultSize = 10 }) => {
        const q = parse(location.search);
        return {
          variables: {
            ssmsTable_filters: parseFilterParam(
              q.ssmsTable_filters,
              defaultFilters,
            ),
            ssmsTable_offset: parseIntParam(q.ssmsTable_offset, 0),
            ssmsTable_size: parseIntParam(q.ssmsTable_size, defaultSize),
            ssmsTable_sort: parseJSURLParam(q.ssmsTable_sort, null),
            ssmCaseFilter: addInFilters(
              q.ssmsTable_filters || defaultFilters,
              makeFilter([
                {
                  field: 'available_variation_data',
                  value: 'ssm',
                },
              ]),
            ),
            score: 'occurrence.case.project.project_id',
            consequenceFilters: {
              op: 'NOT',
              content: {
                field: 'consequence.transcript.annotation.impact',
                value: 'missing',
              },
            },
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
  )((props: mixed) => {
    return (
      <Query
        parentProps={props}
        name="CancerDistributionBarChart"
        minHeight={387}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query CancerDistributionBarChart_relayQuery(
            $ssmTested: FiltersArgument
            $ssmCaseFilter: FiltersArgument
            $ssmsTable_size: Int
            $consequenceFilters: FiltersArgument
            $ssmsTable_offset: Int
            $ssmsTable_filters: FiltersArgument
            $score: String
            $sort: [Sort]
            $ssmCountsFilters: FiltersArgument
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
              }
            }
          }
        `}
      />
    );
  });
