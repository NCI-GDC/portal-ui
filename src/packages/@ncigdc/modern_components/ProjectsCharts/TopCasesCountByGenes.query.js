// @flow

import gql from 'graphql-tag';
import { compose, withPropsOnChange } from 'recompose';

export const mapVars = compose(
  withPropsOnChange(
    ['gene_centric', 'fmgChartFilters'],
    ({ gene_centric, fmgChartFilters }) => {
      const topGenesSource = (gene_centric.hits.edges || []).map(g => g.node);

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
);

export default gql`
  query TopCasesCountByGenesQuery(
    $first: Int
    $geneIds: [String]
    $filters: JSON
  ) {
    analysis {
      top_cases_count_by_genes {
        data(first: $first, gene_ids: $geneIds, filters: $filters)
      }
    }
  }
`;
