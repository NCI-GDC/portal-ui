// @flow

import gql from 'graphql-tag';
import { compose, withPropsOnChange, mapProps } from 'recompose';
import caseHasMutation from '@ncigdc/utils/filters/prepared/caseHasMutation';
import significantConsequences from '@ncigdc/utils/filters/prepared/significantConsequences';

export const mapVars = compose(
  mapProps(props => ({
    ...props,
    projectIds: props.projectsViewer.projects.hits.edges
      .map(x => x.node.project_id)
      .sort(),
  })),
  withPropsOnChange(['projectIds'], ({ projectIds }) => ({
    fmgChartFilters: {
      op: 'AND',
      content: [
        significantConsequences,
        projectIds.length
          ? {
              op: 'in',
              content: {
                field: 'cases.project.project_id',
                value: projectIds,
              },
            }
          : null,
        {
          op: 'in',
          content: {
            field: 'genes.is_cancer_gene_census',
            value: [true],
          },
        },
      ].filter(Boolean),
    },
    caseCountFilters: [
      caseHasMutation,
      projectIds.length
        ? {
            op: 'in',
            content: {
              field: 'cases.project.project_id',
              value: projectIds,
            },
          }
        : null,
    ].filter(Boolean),
  })),
  withPropsOnChange(
    ['caseCountFilters', 'fmgChartFilters'],
    ({ caseCountFilters, fmgChartFilters }) => {
      return {
        variables: {
          caseCount_filters: caseCountFilters.length
            ? { op: 'AND', content: caseCountFilters }
            : null,
          gene_filters: fmgChartFilters,
          score: 'case.project.project_id',
        },
      };
    },
  ),
);

export default gql`
  query GenesAndCasesQuery(
    $score: String
    $caseCount_filters: JSON
    $gene_filters: JSON
  ) {
    case_centric {
      hits(first: 0, filters: $caseCount_filters) {
        total
      }
    }
    gene_centric {
      hits(first: 20, filters: $gene_filters, score: $score) {
        total
        edges {
          node {
            score
            symbol
            gene_id
            filteredCases: case {
              hits(first: 0, filters: $gene_filters) {
                total
              }
            }
            allCases: case {
              hits(first: 0) {
                total
              }
            }
          }
        }
      }
    }
  }
`;
