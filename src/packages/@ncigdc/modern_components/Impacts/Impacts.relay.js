import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';

import { makeFilter } from '@ncigdc/utils/filters';
import { withRouter } from 'react-router-dom';
import { BaseQuery } from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    withPropsOnChange(['ssmId', 'total'], ({ ssmId, total }) => {
      return {
        variables: {
          filters: makeFilter([
            {
              field: 'ssms.ssm_id',
              value: ssmId,
            },
          ]),
          total,
        },
      };
    }),
  )((props: Object) => {
    return (
      <BaseQuery
        name="Impacts"
        parentProps={props}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query Impacts_relayQuery($filters: FiltersArgument, $total: Int) {
            explore {
              ssms {
                hits(filters: $filters, first: 1) {
                  edges {
                    node {
                      consequence {
                        hits(first: $total) {
                          edges {
                            node {
                              transcript {
                                is_canonical
                                annotation {
                                  impact
                                  polyphen_impact
                                  polyphen_score
                                  sift_score
                                  sift_impact
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
            }
          }
        `}
      />
    );
  });
