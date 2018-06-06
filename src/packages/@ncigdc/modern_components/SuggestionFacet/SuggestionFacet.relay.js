// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { compose, withPropsOnChange, withState } from 'recompose';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withState('facetSearch', 'setFacetSearch', ''),
    withPropsOnChange(
      ['queryType', 'facetSearch'],
      ({ queryType, facetSearch }) => {
        const showCases = queryType === 'case';
        const showFiles = queryType === 'file';
        const showProjects = queryType === 'project';
        return {
          variables: {
            showCases,
            showFiles,
            showProjects,
            queryType: [queryType],
            query: facetSearch,
          },
        };
      },
    ),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        variables={props.variables}
        Component={Component}
        setFacetSearch={props.setFacetSearch}
        query={graphql`
          query SuggestionFacet_relayQuery(
            $query: String
            $showFiles: Boolean!
            $showCases: Boolean!
            $showProjects: Boolean!
            $queryType: [String]
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
            }
          }
        `}
      />
    );
  });
