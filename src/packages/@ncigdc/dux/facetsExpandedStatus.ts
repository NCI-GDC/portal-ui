import { namespaceActions } from './utils';
import _ from 'lodash';
import { clinicalFacets } from '@ncigdc/containers/explore/presetFacets';
/*----------------------------------------------------------------------------*/

const facetsExpandedStatus = namespaceActions('facetsExpandedStatus', [
  'ADD_FACET_NAMES',
  'CHANGE_EXPANDED_STATUS',
  'RESET_EXPANDED_STATUS',
  'EXPAND_ONE_CATEGORY',
]);

const addAllFacets = (facets: any) => ({
  type: facetsExpandedStatus.ADD_FACET_NAMES,
  payload: { facets },
});

const changeFacetNames = (
  category: string,
  field: string,
  expanded?: boolean
) => ({
  type: facetsExpandedStatus.CHANGE_EXPANDED_STATUS,
  payload: { category, field, expanded },
});

const expandOneCategory = (category: string, isExpanded: boolean) => ({
  type: facetsExpandedStatus.EXPAND_ONE_CATEGORY,
  payload: { category, isExpanded },
});

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
      const { facets } = action.payload;
      return _.mapValues(facets, (facet, key) => ({
        expanded: state[key].expanded,
        facets: facet.reduce((acc: any, f: any) => {
          const name = f.field.split('.').slice(-1)[0];
          return {
            ...acc,
            [name]: !!state[key].facets[name],
          };
        }, {}),
      }));
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
    case facetsExpandedStatus.EXPAND_ONE_CATEGORY: {
      const { category, isExpanded } = action.payload;
      return {
        ...state,
        [category]: {
          ...state[category],
          facets: Object.keys(state[category].facets).reduce(
            (acc: any, facetName: string) => ({
              ...acc,
              [facetName]: isExpanded,
            }),
            {}
          ),
        },
      };
    }
    default:
      return state;
  }
};

export { addAllFacets, changeFacetNames, expandOneCategory };
export default reducer;
