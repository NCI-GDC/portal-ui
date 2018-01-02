// @flow

import React from 'react';
import { graphql } from 'react-relay';
import { makeFilter } from '@ncigdc/utils/filters';
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
    // withState('shouldHideUselessFacets', 'setShouldHideUselessFacets', false),

    // withProps(
    //   ({
    //     setIsLoadingAdditionalFacetData,
    //     setShouldHideUselessFacets,
    //     facetMapping,
    //     docType,
    //   }) => ({
    //     setUselessFacetVisibility: shouldHideUselessFacets => {
    //       setShouldHideUselessFacets(shouldHideUselessFacets);
    //       localStorage.setItem(
    //         'shouldHideUselessFacets',
    //         JSON.stringify(shouldHideUselessFacets),
    //       );
    //       const byDocType = _.groupBy(facetMapping, o => o.doc_type);
    //       if (shouldHideUselessFacets && byDocType[docType]) {
    //         setIsLoadingAdditionalFacetData(shouldHideUselessFacets);
    //         return {
    //           variables: {
    //             repoCaseCustomFacetFields: byDocType[docType]
    //               .map(({ field }) => field)
    //               .join(','),
    //           },
    //         };
    //         // relay.setVariables(
    //         //   {
    //         //     [relayVarName]: byDocType[docType]
    //         //       .map(({ field }) => field)
    //         //       .join(','),
    //         //   },
    //         //   readyState => {
    //         //     if (
    //         //       _.some([readyState.ready, readyState.aborted, readyState.error])
    //         //     ) {
    //         //       setIsLoadingAdditionalFacetData(false);
    //         //     }
    //         //   },
    //         // );
    //       }
    //     },
    //   }),
    // ),
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
