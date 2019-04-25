/* @flow */

import React from 'react';
import { graphql } from 'react-relay';
import {
  compose, withPropsOnChange, branch, renderComponent,
} from 'recompose';
import { makeFilter } from '@ncigdc/utils/filters';
import significantConsequences from '@ncigdc/utils/filters/prepared/significantConsequences';
import Query from '@ncigdc/modern_components/Query';
import withFilters from '@ncigdc/utils/withFilters';

export default (Component: Object) => compose(
  branch(
    ({ geneId }) => !geneId,
    renderComponent(() => (
      <div>
        <pre>geneId</pre>
        {' '}
must be provided
      </div>
    )),
  ),
  withFilters(),
  withPropsOnChange(['geneId', 'filters'], ({ geneId, filters }) => {
    return {
      variables: {
        filters: makeFilter([
          {
            field: 'genes.gene_id',
            value: [geneId],
          },
        ]),
        ssmsFilters: {
          op: 'and',
          content: [
            significantConsequences,
            ...(filters ? filters.content : []),
            {
              op: 'in',
              content: {
                field: 'genes.gene_id',
                value: [geneId],
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
      Component={Component}
      minHeight={20}
      parentProps={props}
      query={graphql`
          query GeneLolliplot_relayQuery(
            $filters: FiltersArgument
            $ssmsFilters: FiltersArgument
          ) {
            viewer {
              explore {
                genes {
                  hits(first: 1, filters: $filters) {
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
                ssms {
                  aggregations(filters: $ssmsFilters) {
                    consequence__transcript__transcript_id {
                      buckets {
                        doc_count
                        key
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
