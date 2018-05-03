// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
import {
  compose,
  withPropsOnChange,
  branch,
  renderComponent,
  withState,
} from 'recompose';
import Query from '@ncigdc/modern_components/Query';

export default (Component: ReactClass<*>) =>
  compose(
    withState('facetSearch', 'setFacetSearch', ''),
    withPropsOnChange(
      ['doctype', 'facetSearch'],
      ({ doctype, facetSearch }) => {
        const showCases = doctype === 'case';
        const showFiles = doctype === 'file';
        const showProjects = doctype === 'project';
        return {
          variables: {
            showCases,
            showFiles,
            showProjects,
            doctype: [doctype],
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
        docType={props.doctype}
        query={graphql`
          query SuggestionFacet_relayQuery(
            $query: String
            $showFiles: Boolean!
            $showCases: Boolean!
            $showProjects: Boolean!
            $doctype: [String]
          ) {
            facetSearchHits: query(query: $query, types: $doctype) {
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
