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
// const reduceColumns = (acc, x) => [...acc, ...(!x.hidden ? [x.id] : [])];

const initialState = Object.keys(tableModels).reduce(
  (acc, key) => ({
    ...acc,
    [key]: tableModels[key].map(c => ({ [c.id]: !c.hidden })),
    // ids: tableModels[key].reduce(reduceColumns, []),
  }),
  { version: 2 }
);

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      const { version, ...tableColumns } = action.payload.tableColumns || {};

      if (version !== state.version) {
        return state;
      }
      return {
        ...state,
        ...Object.entries(
          tableColumns || {}
        ).reduce((acc, [key, val]: [string, any]) => {
          const order = Array.isArray(val) ? state[key] : val.order;
          const newColumns = state[key].filter(c => !order.includes(c));

          const ids = newColumns
            .filter(id => {
              if (!state[key].order[id]) return false;
              const column = tableModels[key].find(c => c.id === id);
              if (column.subHeading) {
                const parent = tableModels[key].find(
                  c => c.id === column.parent
                );
                if (parent) {
                  return (
                    state[key].order[parent.id] &&
                    newColumns.includes(parent.id)
                  );
                }
              }
              return true;
            })
            .concat(Array.isArray(val) ? val : val.ids);

          return {
            ...acc,
            [key]: [...newColumns, ...order],
          };
        }, {}),
      };
    }

    case tableColumns.TOGGLE_COLUMN: {
      const { entityType, id, index } = action.payload;
      const tableInfo = state[entityType];
      return {
        ...state,
        [entityType]: [
          ...tableInfo.slice(0, index),
          { [id]: !tableInfo[index][id] },
          ...tableInfo.slice(index + 1, Infinity),
        ],
      };
      // return state[entityType].find(x => x[id] === id && x.va)
      //   ? {
      //       ...state,
      //       [entityType]: {
      //         ...state[entityType],
      //         ids: state[entityType].ids.filter(x => x !== id),
      //       },
      //     }
      //   : {
      //       ...state,
      //       [entityType]: {
      //         ...state[entityType],
      //         ids: [
      //           ...state[entityType].ids.slice(0, index),
      //           id,
      //           ...state[entityType].ids.slice(index, Infinity),
      //         ],
      //       },
      //     };
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
      console.log('order', order);

      return { ...state, [entityType]: order };
    }

    default:
      return state;
  }
};

/*----------------------------------------------------------------------------*/

export { toggleColumn, restoreColumns, setColumns };
export default reducer;
