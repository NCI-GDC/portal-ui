/* @flow */
/* eslint fp/no-this: 0, max-len: 1 */
import _ from 'lodash';
import { connect } from 'react-redux';
import { withState, withProps, withHandlers, compose } from 'recompose';
import { add, remove, reset } from '@ncigdc/dux/customFacets';
import withRouter from '@ncigdc/utils/withRouter';
import { removeFilter } from '@ncigdc/utils/filters/index';
import { parseFilterParam, stringifyJSONParam } from '@ncigdc/utils/uri';
import removeEmptyKeys from '@ncigdc/utils/removeEmptyKeys';

type TProps = {
  entityType: string,
  presetFacetFields: Array<string>,
  validFacetDocTypes: Array<string>,
  validFacetPrefixes?: Array<string>,
};

export default ({
  entityType,
  presetFacetFields,
  validFacetDocTypes,
  validFacetPrefixes,
}: TProps) =>
  compose(
    connect((state, props) => ({
      userSelectedFacets: state.customFacets[entityType],
    })),
    withState('shouldShowFacetSelection', 'setShouldShowFacetSelection', false),
    withProps(({ userSelectedFacets }) => ({
      facetExclusionTest: facet => {
        // The list of facets that should be excluded. But for explore case tab, user selected facets have been replaced in clinical tab.
        // So if eentityType is 'ExploreCases', ignore the userSelectedFacets.
        const facetFieldNamesToExclude =
          entityType === 'ExploreCases'
            ? presetFacetFields
            : presetFacetFields.concat(userSelectedFacets.map(x => x.field));

        const match = _.some([
          !_.includes(validFacetDocTypes, facet.doc_type),
          _.includes(facetFieldNamesToExclude, facet.field),
          validFacetPrefixes &&
            !_.includes(validFacetPrefixes.map(p => facet.full.indexOf(p)), 0),
        ]);
        return match;
      },
    })),
    withRouter,
    withHandlers({
      handleSelectFacet: ({
        userSelectedFacets,
        setShouldShowFacetSelection,
        dispatch,
      }) => facet => {
        setShouldShowFacetSelection(false);
        dispatch(add({ entityType, facet }));
      },
      handleResetFacets: ({ dispatch }) => () => {
        dispatch(reset({ entityType }));
      },
      handleRequestRemoveFacet: ({
        userSelectedFacets,
        dispatch,
        push,
        query,
      }) => facet => {
        dispatch(remove({ entityType, field: facet.field }));
        const newFilters = removeFilter(
          facet.full,
          parseFilterParam(query.filters),
        );

        return push({
          query: removeEmptyKeys({
            ...query,
            filters: newFilters && stringifyJSONParam(newFilters),
          }),
        });
      },
    }),
  );
