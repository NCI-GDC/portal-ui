// @flow
import { REHYDRATE } from 'redux-persist/constants';

// Custom
import tableModels from '@ncigdc/tableModels';
import { namespaceActions } from './utils';

/*----------------------------------------------------------------------------*/

const tableColumns = namespaceActions('tableColumns', [
  'TOGGLE_COLUMN',
  'RESTORE',
  'SET',
]);

const toggleColumn = ({ entityType, id, index }) => ({
  type: tableColumns.TOGGLE_COLUMN,
  payload: { entityType, id, index },
});

const restoreColumns = entityType => ({
  type: tableColumns.RESTORE,
  payload: { entityType },
});

const setColumns = ({ entityType, order }) => ({
  type: tableColumns.SET,
  payload: { entityType, order },
});

// Store ids of table items that are not hidden by default
// const reduceColumns = (acc, x) => [...acc, ...(!x.hidden ? [x.id] : [])];

const initialState = Object.keys(tableModels).reduce(
  (acc, key) => ({
    ...acc,
    [key]: tableModels[key],
  }),
  { version: 2 }
);

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      const { version, ...tableColumns } = action.payload.tableColumns || {};
      console.log('reducer', tableColumns);
      if (version !== state.version) {
        return state;
      }
      console.log('order111', tableColumns.genes);
      return {
        ...state,
        ...Object.entries(
          tableColumns || {}
        ).reduce((acc, [key, val]: [string, any]) => {
          const order = Array.isArray(val) ? state[key] : val;
          return {
            ...acc,
            [key]: order,
          };
        }, {}),
      };
    }

    case tableColumns.TOGGLE_COLUMN: {
      const { entityType, id, index } = action.payload;
      return {
        ...state,
        [entityType]: [
          ...state[entityType].slice(0, index),
          {
            ...state[entityType][index],
            hidden: !state[entityType][index].hidden,
          },
          ...state[entityType].slice(index + 1, Infinity),
        ],
      };
    }

    case tableColumns.RESTORE: {
      const { entityType } = action.payload;
      return {
        ...state,
        [entityType]: initialState[entityType],
      };
    }

    case tableColumns.SET: {
      const { entityType, order } = action.payload;
      console.log('order2', state.genes, order);
      return { ...state, [entityType]: order };
    }

    default:
      return state;
  }
};

/*----------------------------------------------------------------------------*/

export { toggleColumn, restoreColumns, setColumns };
export default reducer;
