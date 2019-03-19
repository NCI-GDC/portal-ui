// @flow
// import { get, set } from 'lodash';

// Custom
import { namespaceActions } from './utils';

import { clinicalFacets } from '@ncigdc/containers/explore/presetFacets';
/*----------------------------------------------------------------------------*/

const facetsExpandedStatus = namespaceActions('facetsExpandedStatus', [
  'ADD_FACET_NAMES',
  'CHANGE_EXPANDED_STATUS',
  'RESET_EXPANDED_STATUS',
  'EXPAND_ONE_CATEGORY',
]);

const addFacetNames = (category: string, facetNames: string[]) => ({
  type: facetsExpandedStatus.ADD_FACET_NAMES,
  payload: { category, facetNames },
});

const changeFacetNames = (
  category: string,
  field: string,
  expanded?: boolean
) => ({
  type: facetsExpandedStatus.CHANGE_EXPANDED_STATUS,
  payload: { category, field, expanded },
});

// const expandOneCategory = (category: string, isExpanded: boolean) => ({
//   type: facetsExpandedStatus.EXPAND_ONE_CATEGORY,
//   payload: {category,isExpanded},
// });
// const resetFacetNames = () => ({
//   type: facetsExpandedStatus.RESET_EXPANDED_STATUS,
//   payload: {},
// });

const initialState = clinicalFacets.reduce(
  (acc, facet: any) => ({
    ...acc,
    [facet.field]: { expanded: true, facets: {} },
  }),
  {}
);

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case facetsExpandedStatus.ADD_FACET_NAMES: {
      const { category, facetNames } = action.payload;
      return {
        ...state,
        [category]: {
          ...state[category],
          facets: {
            ...state[category].facets,
            ...facetNames.reduce(
              (acc: any, facetName: string) => ({
                ...acc,
                [facetName]: false,
              }),
              {}
            ),
          },
        },
      };
    }
    case facetsExpandedStatus.CHANGE_EXPANDED_STATUS: {
      const { category, field, expanded } = action.payload;
      if (field) {
        return {
          ...state,
          [category]: {
            ...state[category],
            facets: {
              ...state[category].facets,
              [field]: !state[category].facets[field],
            },
          },
        };
      } else {
        return {
          ...state,
          [category]: {
            ...state[category],
            expanded:
              typeof expanded === 'undefined'
                ? !state[category].expanded
                : expanded,
          },
        };
      }
    }
    // case facetsExpandedStatus.EXPAND_ONE_CATEGORY:{
    //   const category = action.payload;
    //   return {
    //     ...state,
    //     [category]: {
    //       ...state[category],
    //       facets: {
    //         ...state[category].facets,
    //         ...facetNames.reduce(
    //           (acc: any, facetName: string) => ({
    //             ...acc,
    //             [facetName]: false,
    //           }),
    //           {}
    //         ),
    //       },
    //     },
    //   };
    // }
    default:
      return state;
  }
};

export { addFacetNames, changeFacetNames };
export default reducer;
