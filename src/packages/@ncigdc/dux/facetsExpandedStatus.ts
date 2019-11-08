import { namespaceActions } from './utils';
import _ from 'lodash';
import { clinicalFacets } from '@ncigdc/containers/explore/presetFacets';
import {
  IFacetProps,
  IFilteredFacetsProps
} from '@ncigdc/containers/explore/ClinicalAggregations';
/*----------------------------------------------------------------------------*/

const facetsExpandedStatus = namespaceActions('facetsExpandedStatus', [
  'ADD_FACET_NAMES',
  'CHANGE_EXPANDED_STATUS',
  'RESET_EXPANDED_STATUS',
  'EXPAND_ONE_CATEGORY',
  'MORE_BY_CATEGORY',
]);
export interface IExpandedStatusActionProps {
  type: string;
  payload: {
    facets?: IFilteredFacetsProps | {};
    category?: string;
    field?: string;
    isExpanded?: boolean;
  };
}

export interface IExpandedStatusStateProps {
  [x: string]: {
    expanded: boolean;
    showingMore: boolean;
    facets: {
      [x: string]: boolean;
    };
  };
}
const addAllFacets = (facets: IFacetProps | {}) => ({
  type: facetsExpandedStatus.ADD_FACET_NAMES,
  payload: { facets },
});

const changeExpandedStatus = (category: string, field: string) => ({
  type: facetsExpandedStatus.CHANGE_EXPANDED_STATUS,
  payload: { category, field },
});

const expandOneCategory = (category: string, isExpanded: boolean) => ({
  type: facetsExpandedStatus.EXPAND_ONE_CATEGORY,
  payload: { category, isExpanded },
});

const showingMoreByCategory = (category: string) => ({
  type: facetsExpandedStatus.MORE_BY_CATEGORY,
  payload: { category },
});
const initialState = clinicalFacets.reduce(
  (acc, facet) => ({
    ...acc,
    [facet.field]: { showingMore: false, expanded: true, facets: {} },
  }),
  {}
);

const reducer = (
  state: IExpandedStatusStateProps = initialState,
  action: IExpandedStatusActionProps
) => {
  switch (action.type) {
    case facetsExpandedStatus.ADD_FACET_NAMES: {
      const { facets } = action.payload;

      return _.mapValues(facets, (facet, key) => ({
        expanded: state[key].expanded,
        showingMore: state[key].showingMore,
        facets: {
          ...state[key].facets,
          ...facet.reduce((acc: { [x: string]: boolean }, f: IFacetProps) => {
            const name = f.field.split('.').pop() || '';
            return {
              ...acc,
              [name]: !!state[key].facets[name],
            };
          }, {}),
        },
      }));
    }
    case facetsExpandedStatus.CHANGE_EXPANDED_STATUS: {
      const { category = '', field } = action.payload;
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
            expanded: !state[category].expanded,
          },
        };
      }
    }
    case facetsExpandedStatus.EXPAND_ONE_CATEGORY: {
      const { category = '', isExpanded } = action.payload;
      return {
        ...state,
        [category]: {
          ...state[category],
          expanded: isExpanded || state[category].expanded,
          showingMore: isExpanded,
          facets: Object.keys(state[category].facets).reduce(
            (acc: { [x: string]: boolean }, facetName: string) => ({
              ...acc,
              [facetName]: isExpanded,
            }),
            {}
          ),
        },
      };
    }
    case facetsExpandedStatus.MORE_BY_CATEGORY: {
      const { category = '' } = action.payload;
      return {
        ...state,
        [category]: {
          ...state[category],
          showingMore: !state[category].showingMore,
        },
      };
    }

    default:
      return state;
  }
};

export {
  addAllFacets,
  changeExpandedStatus,
  expandOneCategory,
  showingMoreByCategory
};
export default reducer;
