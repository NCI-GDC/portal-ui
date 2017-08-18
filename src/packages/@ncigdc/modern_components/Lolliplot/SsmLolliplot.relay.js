/* @flow */

import React from 'react';
import { graphql } from 'react-relay';
import { compose, branch, withPropsOnChange, renderComponent } from 'recompose';
import { makeFilter } from '@ncigdc/utils/filters';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    branch(
      ({ ssmId }) => !ssmId,
      renderComponent(() => <div><pre>ssmId</pre> must be provided</div>),
    ),
    withPropsOnChange(['ssmId'], ({ ssmId }) => {
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
    }),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        minHeight={20}
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
