// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { withRouter } from 'react-router-dom';
import { parse } from 'query-string';
import { compose, withPropsOnChange } from 'recompose';
import Query from '@ncigdc/modern_components/Query';
import {
  parseIntParam,
  parseFilterParam,
  parseJSURLParam,
} from '@ncigdc/utils/uri';

const DEFAULT_PROJECT_SORT = [{ field: 'summary.case_count', order: 'desc' }];

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(['location'], ({ location: { search } }) => {
      const q = parse(search);

      return {
        variables: {
          offset: parseIntParam(q.offset, 0),
          size: 1000,
          filters: parseFilterParam(q.filters, null),
          projects_sort: parseJSURLParam(q.projects_sort, DEFAULT_PROJECT_SORT),
        },
      };
    }),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        name="ProjectsCharts"
        minHeight={280}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query ProjectsCharts_relayQuery(
            $size: Int
            $offset: Int
            $projects_sort: [Sort]
            $filters: FiltersArgument
          ) {
            projectsViewer: viewer {
              projects {
                hits(first: $size offset: $offset, sort: $projects_sort, filters: $filters) {
                  total
                  edges {
                    node {
                      id
                      project_id
                      name
                      disease_type
                      program {
                        name
                      }
                      primary_site
                      summary {
                        case_count
                        data_categories {
                          case_count
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
        `}
      />
    );
  });
