// @flow

import React from 'react';
import { graphql } from 'react-relay';
import {
  compose,
  withPropsOnChange,
  withState,
  branch,
  lifecycle,
  renderComponent,
  setDisplayName,
} from 'recompose';
import _ from 'lodash';

import Query from '@ncigdc/modern_components/Query';
import { fetchApi } from '@ncigdc/utils/ajax/index';

export default (Component: ReactClass<*>) =>
  compose(
    setDisplayName('EnhancedFacetSelection_relay'),
    withState('facetMapping', 'setFacetMapping', null),
    withState('hideUselessFacets', 'setHideUselessFacets', false),
    lifecycle({
      async componentDidMount() {
        const { setFacetMapping } = this.props;

        const mapping = await fetchApi('gql/_mapping', {
          headers: { 'Content-Type': 'application/json' },
        });
        setFacetMapping(mapping);
      },
    }),
    branch(({ facetMapping }) => !facetMapping, renderComponent(() => null)),
    withPropsOnChange(
      [
        'facetMapping',
        'filters',
        'docType',
      ],
      ({
        docType,
        facetMapping,
        filters,
      }) => {
        const facetsByDocType = _.groupBy(facetMapping, o => o.doc_type);
        const showCases = docType === 'cases';
        const showFiles = docType === 'files';

        return {
          variables: {
            filters,
            repoCustomFacetFields: facetsByDocType[docType]
              .map(({ field }) => field)
              .join(','),
            showCases,
            showFiles,
          },
        };
      },
    ),
  )((props: Object) => {
    return (
      <Query
        Component={Component}
        // ** Hacky solution to load the modal before the query is complete
        Loader={() => null}
        loaderProps={{
          ignoreFirstLoad: true,
        }}
        // **
        parentProps={props}
        query={props.hideUselessFacets && graphql`
          query FacetSelection_relayQuery(
            $filters: FiltersArgument
            $repoCustomFacetFields: [String]!
            $showCases: Boolean!
            $showFiles: Boolean!
          ) {
            viewer {
              repository {
                cases @include(if: $showCases) {
                  facets(facets: $repoCustomFacetFields, filters: $filters)
                }
                files @include(if: $showFiles) {
                  facets(facets: $repoCustomFacetFields, filters: $filters)
                }
              }
            }
          }
        `}
        variables={props.variables}
        />
    );
  });
