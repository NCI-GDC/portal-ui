// @flow
import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange, withState } from 'recompose';
import Query from '@ncigdc/modern_components/Query';
import { trim } from 'lodash';

export default (Component: ReactClass<*>) => compose(
  withState('facetSearch', 'setFacetSearch', ''),
  withPropsOnChange(
    ['queryType', 'facetSearch'],
    ({ facetSearch, queryType }) => {
      const showCases = queryType === 'case';
      const showFiles = queryType === 'file';
      const showProjects = queryType === 'project';
      const showGenes = queryType === 'gene_centric';
      return {
        variables: {
          query: trim(facetSearch),
          queryType: [queryType],
          showCases,
          showFiles,
          showGenes,
          showProjects,
        },
      };
    },
  ),
)((props: Object) => {
  return (
    <Query
      cacheConfig={{ requiresStudy: true }}
      Component={Component}
      parentProps={props}
      query={graphql`
        query SuggestionFacet_relayQuery(
          $query: String
          $queryType: [String]
          $showCases: Boolean!
          $showFiles: Boolean!
          $showGenes: Boolean!
          $showProjects: Boolean!
        ) {
          facetSearchHits: query(query: $query, types: $queryType) {
            files: hits @include(if: $showFiles) {
              id
              ... on File {
                file_id
                submitter_id
                file_name
              }
            }
            cases: hits @include(if: $showCases) {
              id
              ... on Case {
                case_id
                project {
                  project_id
                }
                submitter_id
              }
            }
            projects: hits @include(if: $showProjects) {
              id
              ... on Project {
                project_id
                name
                primary_site
              }
            }
            genes: hits @include(if: $showGenes) {
              id
              ...on Gene {
                symbol
                name
                gene_id
              }
            }
          }
        }
      `}
      setFacetSearch={props.setFacetSearch}
      variables={props.variables}
      />
  );
});
