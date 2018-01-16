/* @flow */

import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
import { compose, withPropsOnChange, branch, renderComponent } from 'recompose';
import Query from '@ncigdc/modern_components/Query';
import { withRouter } from 'react-router-dom';
import { parseFilterParam } from '@ncigdc/utils/uri';
import { parse } from 'query-string';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    branch(
      ({ primarySite }) => !primarySite,
      renderComponent(() => (
        <div>
          <pre>Primary site</pre> must be provided
        </div>
      )),
    ),
    withPropsOnChange(
      ['location'],
      ({ location: { search }, defaultFilters = null }) => {
        const q = parse(search);
        const filters = parseFilterParam(q.filters, defaultFilters);
        return {
          filters,
        };
      },
    ),
    withPropsOnChange(
      ['primarySite', 'filters', 'projectId'],
      ({ primarySite, filters, projectId }) => {
        return {
          variables: {
            ...filters,
            filters: makeFilter([
              {
                field: 'cases.primary_site',
                value: [primarySite],
              },
              { field: 'cases.project.project_id', value: projectId },
            ]),
          },
        };
      },
    ),
  )((props: Object) => {
    return (
      <Query
        name="DiseaseListByPrimarySite"
        parentProps={props}
        minHeight={20}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query DiseaseListByPrimarySite_relayQuery($filters: FiltersArgument) {
            repository {
              cases {
                hits(filters: $filters) {
                  total
                }
                aggregations(filters: $filters) {
                  files__data_category {
                    buckets {
                      doc_count
                      key
                    }
                  }
                  disease_type {
                    buckets {
                      doc_count
                      key
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
