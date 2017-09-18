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
      renderComponent(() => (
        <div>
          <pre>ssmId</pre> must be provided
        </div>
      )),
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
        minHeight={props.minHeight || 200}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query SsmSummary_relayQuery($filters: FiltersArgument) {
            viewer {
              explore {
                ssms {
                  hits(first: 1, filters: $filters) {
                    edges {
                      node {
                        ssm_id
                        reference_allele
                        mutation_subtype
                        ncbi_build
                        genomic_dna_change
                        consequence {
                          hits(first: 99) {
                            edges {
                              node {
                                transcript {
                                  transcript_id
                                  annotation {
                                    impact
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
