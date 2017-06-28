/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { makeFilter } from '@ncigdc/utils/filters';
import Query from '@ncigdc/modern_components/Query';

export default (Component: Object) =>
  compose(
    withPropsOnChange(['geneId'], ({ geneId = 'ENSG00000134086' }) => {
      return {
        variables: {
          filters: makeFilter([
            {
              field: 'genes.gene_id',
              value: [geneId],
            },
          ]),
        },
      };
    }),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        name="GeneLolliplot"
        minHeight={387}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query GeneLolliplot_relayQuery(
            $filters: FiltersArgument
          ) {
            viewer {
              explore {
                genes {
                  hits(first: 1 filters: $filters) {
                    edges {
                      node {
                        gene_id
                        symbol
                        canonical_transcript_id
                        transcripts {
                          hits(first: 99) {
                            edges {
                              node {
                                is_canonical
                                transcript_id
                                length_amino_acid
                                domains {
                                  hit_name
                                  description
                                  start
                                  end
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
