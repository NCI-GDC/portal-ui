/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { makeFilter } from '@ncigdc/utils/filters';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withPropsOnChange(
      ['ssmId'],
      ({ ssmId = 'a0fe6696-dd49-555d-bb9e-cdbec315dbb3' }) => {
        return {
          variables: {
            filters: makeFilter([
              {
                field: 'ssms.ssm_id',
                value: [ssmId],
              },
            ]),
          },
        };
      },
    ),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        name="SsmLolliplot"
        minHeight={387}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query SsmLolliplot_relayQuery(
            $filters: FiltersArgument
          ) {
            ssmsViewer: viewer {
              explore {
                ssms {
                  hits(first: 1 filters: $filters) {
                    edges {
                      node {
                        consequence {
                          hits(first: 99) {
                            edges {
                              node {
                                transcript {
                                  transcript_id
                                  is_canonical
                                  gene {
                                    gene_id
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
          }
        `}
      />
    );
  });
