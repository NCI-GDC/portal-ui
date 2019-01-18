// @flow
import { uniqBy } from 'lodash';

// Custom
import { namespaceActions } from './utils';

/*----------------------------------------------------------------------------*/

const customFacets = namespaceActions('customFacets', [
  'ADD_FACET',
  'REMOVE_FACET',
  'RESET_FACETS',
]);

const add = ({ entityType, facet }: { entityType: string, facet: Object }) => ({
  type: customFacets.ADD_FACET,
  payload: { entityType, facet },
});

const remove = ({
  entityType,
  field,
}: {
  entityType: string,
  field: string,
}) => ({
  type: customFacets.REMOVE_FACET,
  payload: { entityType, field },
});

const reset = ({ entityType }: { entityType: string }) => ({
  type: customFacets.RESET_FACETS,
  payload: { entityType },
});

const entityTypesWithCustomFacets = [
  'RepositoryCases',
  'ExploreCases',
  'Files',
];

const initialState = entityTypesWithCustomFacets.reduce(
  (acc, type) => ({
    ...acc,
    [type]: [],
  }),
  {},
);

const reducer = (
  state: Object = initialState,
  action: {
    type: string,
    payload: { entityType: string, field?: string, facet?: Object },
  },
) => {
  switch (action.type) {

    case customFacets.ADD_FACET: {
      const { entityType, facet } = action.payload;
      return {
        ...state,
        [entityType]: uniqBy([...state[entityType], facet], ({ full }) => full),
      };
    }

    case customFacets.REMOVE_FACET: {
      const { entityType, field } = action.payload;
      return {
        ...state,
        [entityType]: state[entityType].filter(facet => facet.field !== field),
      };
    }

    case customFacets.RESET_FACETS: {
      const { entityType } = action.payload;
      return { ...state, [entityType]: [] };
    }

    default:
      return state;
  }
};

export { add, remove, reset };
export default reducer;
