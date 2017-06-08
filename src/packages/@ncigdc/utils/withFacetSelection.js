/* @flow */
/* eslint fp/no-this: 0, max-len: 1 */
import _ from 'lodash';
import JSURL from 'jsurl';
import {
  withState,
  withProps,
  lifecycle,
  withHandlers,
  compose,
} from 'recompose';
import tryParseJSON from '@ncigdc/utils/tryParseJSON';
import withRouter from '@ncigdc/utils/withRouter';
import { removeFilter } from '@ncigdc/utils/filters/index';
import { removeEmptyKeys, parseFilterParam } from '@ncigdc/utils/uri/index';

type TProps = {
  storageKey: string,
  presetFacetFields: Array<string>,
  validFacetDocTypes: Array<string>,
  validFacetPrefixes?: Array<string>,
};

export default ({
  storageKey,
  presetFacetFields,
  validFacetDocTypes,
  validFacetPrefixes,
}: TProps) =>
  compose(
    withState('shouldShowFacetSelection', 'setShouldShowFacetSelection', false),
    withState('userSelectedFacets', 'setUserSelectedFacets', []),
    withProps(({ userSelectedFacets, setUserSelectedFacets }) => ({
      facetExclusionTest: facet => {
        const facetFieldNamesToExclude = presetFacetFields.concat(
          userSelectedFacets.map(x => x.field),
        );
        const match = _.some([
          !_.includes(validFacetDocTypes, facet.doc_type),
          _.includes(facetFieldNamesToExclude, facet.field),
          validFacetPrefixes &&
            !_.includes(validFacetPrefixes.map(p => facet.full.indexOf(p)), 0),
        ]);
        return match;
      },
      loadUserSelectedFacetsFromStorage: () => {
        const userSelectedFacetsFromStorage =
          tryParseJSON(window.localStorage.getItem(storageKey) || null) || [];
        setUserSelectedFacets(
          _.uniqBy(
            userSelectedFacets.concat(userSelectedFacetsFromStorage),
            x => x.full,
          ),
        );
      },
      saveFacetsToStorage: facets => {
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(facets));
        } catch (error) {
          console.error(
            'Unable to save user selected facets to localStorage',
            error,
          );
        }
      },
    })),
    lifecycle({
      componentWillMount(): void {
        this.props.loadUserSelectedFacetsFromStorage();
      },
    }),
    withRouter,
    withHandlers({
      handleSelectFacet: ({
        userSelectedFacets,
        setUserSelectedFacets,
        saveFacetsToStorage,
        setShouldShowFacetSelection,
      }) => facet => {
        const facets = _.uniqBy([facet, ...userSelectedFacets], x => x.full);
        setShouldShowFacetSelection(false);
        setUserSelectedFacets(facets);
        saveFacetsToStorage(facets);
      },
      handleResetFacets: ({
        setUserSelectedFacets,
        saveFacetsToStorage,
      }) => () => {
        setUserSelectedFacets([]);
        saveFacetsToStorage();
      },
      handleRequestRemoveFacet: ({
        userSelectedFacets,
        setUserSelectedFacets,
        saveFacetsToStorage,
        push,
        query,
      }) => facet => {
        const facets = _.without(userSelectedFacets, facet);
        setUserSelectedFacets(facets);
        saveFacetsToStorage(facets);

        const newFilters = removeFilter(
          facet.full,
          parseFilterParam(query.filters),
        );

        push({
          query: removeEmptyKeys({
            ...query,
            filters: newFilters && JSURL.stringify(newFilters),
          }),
        });
      },
    }),
  );
