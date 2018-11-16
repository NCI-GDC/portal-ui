// @flow

import React from 'react';
import { graphql } from 'react-relay';
import {
  compose,
  withPropsOnChange,
  withProps,
  withState,
  branch,
  lifecycle,
  renderComponent,
} from 'recompose';
import _ from 'lodash';
import { css } from 'glamor';

import Query from '@ncigdc/modern_components/Query';
import { fetchApi } from '@ncigdc/utils/ajax/index';
import { Column } from '@ncigdc/uikit/Flex';
import { redirectToLogin } from '@ncigdc/utils/auth';
import { IS_AUTH_PORTAL } from '@ncigdc/utils/constants';

const styles = {
  resultsCount: {
    color: '#bb0e3d',
    display: 'inline',
  },
  loadContainer: {
    display: 'flex',
    alignItems: 'center',
  },
};

export default (Component: ReactClass<*>) =>
  compose(
    withState('facetMapping', 'setFacetMapping', null),
    withState('shouldHideUselessFacets', 'setShouldHideUselessFacets', false),
    withProps(({ setShouldHideUselessFacets }) => ({
      setUselessFacetVisibility: shouldHideUselessFacets => {
        setShouldHideUselessFacets(shouldHideUselessFacets);
        localStorage.setItem(
          'shouldHideUselessFacets',
          JSON.stringify(shouldHideUselessFacets),
        );
      },
    })),
    lifecycle({
      async componentDidMount() {
        let { setFacetMapping, setUselessFacetVisibility } = this.props;
        const mapping = await fetchApi('gql/_mapping', {
          headers: { 'Content-Type': 'application/json' },
        });
        setFacetMapping(mapping);
        JSON.parse(localStorage.getItem('shouldHideUselessFacets') || 'null') &&
          setUselessFacetVisibility(true);
      },
    }),
    branch(({ facetMapping }) => !facetMapping, renderComponent(() => null)),
    withPropsOnChange(
      ['availableCaseFacets', 'facetMapping', 'filters', 'docType'],
      ({ facetMapping, availableCaseFacets, filters, docType }) => {
        const facetsByDocType = _.groupBy(facetMapping, o => o.doc_type);
        const showCases = docType === 'cases';
        const showFiles = docType === 'files';
        return {
          variables: {
            filters,
            showCases,
            showFiles,
            repoCustomFacetFields: facetsByDocType[docType]
              .map(({ field }) => field)
              .join(','),
          },
        };
      },
    ),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        Loader={({ loading }) =>
          !loading ? null : (
            <Column {...css(styles.loadContainer)}>
              <h3 {...css(styles.resultsCount)}>Loading...</h3>
            </Column>
          )}
        variables={props.variables}
        Component={Component}
        query={graphql`
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
      />
    );
  });
