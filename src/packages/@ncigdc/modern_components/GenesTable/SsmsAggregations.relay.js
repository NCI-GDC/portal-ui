import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withPropsOnChange(
      ['genesTableViewer'],
      ({ genesTableViewer, defaultFilters = null }) => {
        const { hits } = genesTableViewer.explore.genes;
        const geneIds = hits.edges.map(e => e.node.gene_id);

        return {
          variables: {
            ssmCountsfilters: geneIds.length
              ? addInFilters(
                  defaultFilters,
                  makeFilter([
                    {
                      field: 'consequence.transcript.gene.gene_id',
                      value: geneIds,
                    },
                  ]),
                )
              : null,
          },
        };
      },
    ),
  )((props: mixed) => {
    return (
      <Query
        parentProps={props}
        name="SsmsAggregations"
        minHeight={387}
        variables={props.variables}
        Component={Component}
        query={graphql`
          query SsmsAggregations_relayQuery(
            $ssmCountsfilters: FiltersArgument
          ) {
            ssmsAggregationsViewer: viewer {
              explore {
                ssms {
                  aggregations(
                    filters: $ssmCountsfilters
                    aggregations_filter_themselves: true
                  ) {
                    consequence__transcript__gene__gene_id {
                      buckets {
                        key
                        doc_count
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
