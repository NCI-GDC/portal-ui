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
import Query from '@ncigdc/modern_components/Query';
import _ from 'lodash';
import { fetchApi } from '../../utils/ajax/index';

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
      async componentDidMount(): void {
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
      ['availableCaseFacets', 'facetMapping', 'filters'],
      ({ facetMapping, availableCaseFacets, filters }) => {
        const facetsByDocType = _.groupBy(facetMapping, o => o.doc_type);
        return {
          variables: {
            filters,
            repoCaseCustomFacetFields: facetsByDocType['cases']
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
        variables={props.variables}
        Component={Component}
        query={graphql`
          query CaseFacetSelection_relayQuery(
            $filters: FiltersArgument
            $repoCaseCustomFacetFields: [String]!
          ) {
            viewer {
              repository {
                cases {
                  facets(facets: $repoCaseCustomFacetFields, filters: $filters)
                }
              }
            }
          }
        `}
      />
    );
  });
