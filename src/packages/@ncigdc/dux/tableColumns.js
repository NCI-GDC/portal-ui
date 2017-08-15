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

const setColumns = payload => ({
  type: tableColumns.SET,
  payload,
});

// Store ids of table items that are not hidden by default
const reduceColumns = (acc, x) => [...acc, ...(!x.hidden ? [x.id] : [])];

const initialState = Object.keys(tableModels).reduce(
  (acc, key) => ({
    ...acc,
    [key]: {
      ids: tableModels[key].reduce(reduceColumns, []),
      order: tableModels[key].map(c => c.id),
    },
  }),
  {},
);

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      return {
        ...state,
        ...Object.entries(
          action.payload.tableColumns || {},
        ).reduce((acc, [key, val]: [string, any]) => {
          const order = Array.isArray(val) ? state[key].order : val.order;
          const newColumns = state[key].order.filter(c => !order.includes(c));

          const ids = newColumns
            .filter(id => {
              if (!state[key].ids.includes(id)) return false;
              const column = tableModels[key].find(c => c.id === id);
              if (column.subHeading) {
                const parent = tableModels[key].find(
                  c => c.id === column.parent,
                );
                if (parent) {
                  return (
                    state[key].ids.includes(parent.id) &&
                    newColumns.includes(parent.id)
                  );
                }
              }
              return true;
            })
            .concat(Array.isArray(val) ? val : val.ids);

          return {
            ...acc,
            [key]: {
              ...state[key],
              ids,
              order: [...newColumns, ...order],
            },
          };
        }, {}),
      };
    }

    case tableColumns.TOGGLE_COLUMN: {
      const { entityType, id, index } = action.payload;
      return state[entityType].ids.find(x => x === id)
        ? {
            ...state,
            [entityType]: {
              ...state[entityType],
              ids: state[entityType].ids.filter(x => x !== id),
            },
          }
        : {
            ...state,
            [entityType]: {
              ...state[entityType],
              ids: [
                ...state[entityType].ids.slice(0, index),
                id,
                ...state[entityType].ids.slice(index, Infinity),
              ],
            },
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
      const { entityType, ids, order } = action.payload;
      return { ...state, [entityType]: { ids, order } };
    }

    default:
      return state;
  }
};

/*----------------------------------------------------------------------------*/

export { toggleColumn, restoreColumns, setColumns };
export default reducer;
