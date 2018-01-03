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
import { connect } from 'react-redux';
import Query from '@ncigdc/modern_components/Query';
import escapeForRelay from '@ncigdc/utils/escapeForRelay';
import tryParseJSON from '@ncigdc/utils/tryParseJSON';
import { parseFilterParam, parseJSONParam } from '@ncigdc/utils/uri';
import withRouter from '@ncigdc/utils/withRouter';
import { parse } from 'query-string';
import _ from 'lodash';
import { fetchApi } from '../../utils/ajax/index';

const entityType = 'RepositoryCases';
export default (Component: ReactClass<*>) =>
  compose(
    withRouter,
    // withPropsOnChange(
    //   ['location'],
    //   ({ location: { search }, defaultFilters = null }) => {
    //     const q = parse(search);
    //     const filters = parseFilterParam(q.filters, defaultFilters);
    //     return {
    //       filters,
    //     };
    //   },
    // ),
    withState('facetMapping', 'setFacetMapping', null),
    lifecycle({
      async componentDidMount(): void {
        let { setFacetMapping } = this.props;
        const mapping = await fetchApi('gql/_mapping', {
          headers: { 'Content-Type': 'application/json' },
        });
        setFacetMapping(mapping);
      },
    }),
    branch(({ facetMapping }) => !facetMapping, renderComponent(() => null)),
    withPropsOnChange(
      ['availableCaseFacets', 'facetMapping', 'filters'],
      ({ facetMapping, availableCaseFacets, filters }) => {
        const byDocType = _.groupBy(facetMapping, o => o.doc_type);
        return {
          variables: {
            filters,
            repoCaseCustomFacetFields: byDocType['cases']
              .map(({ field }) => field)
              .join(','),
          },
        };
      },
    ),
    // withPropsOnChange(
    //   ['isLoadingFacetMapping'],
    //   ({ isLoadingFacetMapping, setUselessFacetVisibility }) =>
    //     !isLoadingFacetMapping &&
    //     JSON.parse(localStorage.getItem('shouldHideUselessFacets') || 'null') &&
    //     setUselessFacetVisibility(true),
    // ),
    // need to filter by useless facets
    // withProps(
    //   ({
    //     facetMapping,
    //     excludeFacetsBy,
    //     query,
    //     shouldHideUselessFacets,
    //     usefulFacets,
    //   }) => ({
    //     filteredFacets: _.filter(_.values(facetMapping), facet =>
    //       _.every([
    //         facetMatchesQuery(facet, query),
    //         !excludeFacetsBy(facet),
    //         !shouldHideUselessFacets ||
    //           Object.keys(usefulFacets).includes(facet.field),
    //       ]),
    //     ),
    //   }),
    // ),
    // withState('shouldHideUselessFacets', 'setShouldHideUselessFacets', false),
  )((props: Object) => {
    return (
      <Query
        parentProps={props}
        // minHeight={278}
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
