import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { parse } from 'query-string';

import { parseIntParam, parseFilterParam } from '@ncigdc/utils/uri';
import { makeFilter } from '@ncigdc/utils/filters';
import { withRouter } from 'react-router-dom';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(
      ['fileId', 'location'],
      ({
        location: { search },
        fileId,
        defaultSize = 10,
        defaultFilters = null,
      }) => {
        const q = parse(search);
        return {
          variables: {
            filters: makeFilter([
              {
                field: 'files.file_id',
                value: fileId,
              },
            ]),
            aeTable_filters: parseFilterParam(q.aeFilters, defaultFilters),
            aeTable_offset: parseIntParam(q.aeTable_offset, 0),
            aeTable_size: parseIntParam(q.aeTable_size, defaultSize),
          },
        };
      },
    ),
  )((props: Object) => {
    return (
      <Query
        name="AssociatedEntitiesTable"
        parentProps={props}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query AssociatedEntitiesTable_relayQuery(
            $filters: FiltersArgument
            $aeTable_filters: FiltersArgument
            $aeTable_size: Int
            $aeTable_offset: Int
          ) {
            repository {
              files {
                hits(filters: $filters, first: 1) {
                  edges {
                    node {
                      annotations {
                        hits(first: 99) {
                          edges {
                            node {
                              annotation_id
                              entity_id
                            }
                          }
                        }
                      }
                      associated_entities {
                        hits(
                          filters: $aeTable_filters
                          first: $aeTable_size
                          offset: $aeTable_offset
                        ) {
                          total
                          edges {
                            node {
                              case_id
                              entity_id
                              entity_submitter_id
                              entity_type
                            }
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
