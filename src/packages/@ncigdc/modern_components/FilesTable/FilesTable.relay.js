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
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) => compose(
  withRouter,
  withPropsOnChange(
    ['location', 'filters'],
    ({ location, filters = null, defaultSize = 10 }) => {
      const q = parse(location.search);
      return {
        variables: {
          files_offset: parseIntParam(q.files_offset, 0),
          files_size: parseIntParam(q.files_size, 20),
          files_sort: parseJSONParam(q.files_sort, null),
          filters: parseFilterParam(q.filters, filters),
        },
      };
    },
  ),
)((props: Object) => {
  return (
    <Query
      Component={Component}
      minHeight={387}
      name="FilesTable"
      parentProps={props}
      query={graphql`
          query FilesTable_relayQuery(
            $files_size: Int
            $files_offset: Int
            $files_sort: [Sort]
            $filters: FiltersArgument
          ) {
            viewer {
              repository {
                files {
                  hits(
                    first: $files_size
                    offset: $files_offset
                    sort: $files_sort
                    filters: $filters
                  ) {
                    total
                    edges {
                      node {
                        id
                        file_id
                        file_name
                        file_size
                        access
                        state
                        acl
                        data_category
                        data_format
                        platform
                        data_type
                        experimental_strategy
                        cases {
                          hits(first: 1) {
                            total
                            edges {
                              node {
                                case_id
                                project {
                                  project_id
                                }
                              }
                            }
                          }
                        }
                        annotations {
                          hits(first: 0) {
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
      variables={props.variables} />
  );
});
