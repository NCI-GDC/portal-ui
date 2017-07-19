// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
import { compose, withPropsOnChange, branch, renderComponent } from 'recompose';
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
          withDbsnp_rs: {
            op: 'AND',
            content: [
              {
                op: 'NOT',
                content: {
                  field: 'consequence.transcript.annotation.dbsnp_rs',
                  value: 'MISSING',
                },
              },
            ],
          },
        },
      };
    }),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        name="SsmExternalReferences"
        minHeight={200}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query SsmExternalReferences_relayQuery(
            $filters: FiltersArgument
            $withDbsnp_rs: FiltersArgument
          ) {
            viewer {
              explore {
                ssms {
                  hits(first: 1 filters: $filters) {
                    edges {
                      node {
                        cosmic_id
                        consequence {
                          hits(first: 1 filters: $withDbsnp_rs) {
                            edges {
                              node {
                                transcript {
                                  annotation {
                                    dbsnp_rs
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
