// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
import {
  compose, withPropsOnChange, branch, renderComponent,
} from 'recompose';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) => compose(
  branch(
    ({ ssmId }) => !ssmId,
    renderComponent(() => (
      <div>
        <pre>ssmId</pre>
        {' '}
must be provided
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
        consequenceFilters: makeFilter([
          {
            field: 'consequence.transcript.is_canonical',
            value: 'true',
          },
        ]),
      },
    };
  }),
)((props: Object) => {
  return (
    <Query
      Component={Component}
      minHeight={props.minHeight || 200}
      parentProps={props}
      query={graphql`
          query SsmSummary_relayQuery(
            $filters: FiltersArgument
            $consequenceFilters: FiltersArgument
          ) {
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
                          hits(first: 1, filters: $consequenceFilters) {
                            edges {
                              node {
                                transcript {
                                  is_canonical
                                  transcript_id
                                  annotation {
                                    polyphen_impact
                                    polyphen_score
                                    sift_score
                                    sift_impact
                                    vep_impact
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
      variables={props.variables} />
  );
});
