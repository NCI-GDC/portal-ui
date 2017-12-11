import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';

import { makeFilter } from '@ncigdc/utils/filters';
import { withRouter } from 'react-router-dom';
import { BaseQuery } from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(['entityId'], ({ entityId }) => {
      return {
        variables: {
          filters: makeFilter([
            {
              field: 'files.annotations.entity_id',
              value: [entityId],
            },
          ]),
        },
      };
    }),
  )((props: Object) => {
    return (
      <BaseQuery
        name="FileAnnotations"
        parentProps={props}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query FileAnnotations_relayQuery($filters: FiltersArgument) {
            repository {
              files {
                hits(filters: $filters, first: 1) {
                  edges {
                    node {
                      annotations {
                        hits(filters: $filters, first: 1) {
                          total
                          edges {
                            node {
                              annotation_id
                              entity_id
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
