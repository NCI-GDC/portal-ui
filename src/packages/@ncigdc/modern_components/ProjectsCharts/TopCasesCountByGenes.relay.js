// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange } from 'recompose';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) => compose(
  withPropsOnChange(
    ['viewer', 'fmgChartFilters'],
    ({ viewer, fmgChartFilters }) => {
      const topGenesSource = (viewer.explore.genes.hits.edges || []).map(
        g => g.node,
      );

      return {
        topGenesSource,
        variables: {
          filters: fmgChartFilters,
          geneIds: topGenesSource.map(g => g.gene_id),
          first: 0,
        },
      };
    },
  ),
)((props: Object) => {
  return (
    <Query
      Component={Component}
      minHeight={280}
      name="TopCasesCountByGenes"
      parentProps={props}
      query={graphql`
          query TopCasesCountByGenes_relayQuery(
            $first: Int
            $geneIds: [String]
            $filters: FiltersArgument
          ) {
            analysisViewer: viewer {
              analysis {
                top_cases_count_by_genes {
                  data(first: $first, gene_ids: $geneIds, filters: $filters)
                }
              }
            }
          }
        `}
      variables={props.variables} />
  );
});
